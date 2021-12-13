package ch.rfobaden.incidentmanager.backend.controllers.base;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public abstract class ModelControllerTest<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TService extends ModelService<TModel, TPath>
    > extends AppControllerTest {
    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected TService service;

    @Autowired
    protected ModelGenerator<TModel> generator;

    protected ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    @Test
    public void testList() throws Exception {
        // Given
        var records = generator.generateNew(10);
        var path = records.get(0).toPath();
        Mockito.when(service.list(path))
            .thenReturn(records);

        // When
        var request = MockMvcRequestBuilders.get(getEndpointFor(path));

        // Then
        mockMvc.perform(request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(records)));
        verify(service, times(1)).list(path);
    }


    @Test
    public void testList_empty() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        Mockito.when(service.list(path))
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get(getEndpointFor(path));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
        verify(service, times(1)).list(path);
    }

    @Test
    public void testFind() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        Mockito.when(service.find(path, record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var mockRequest = MockMvcRequestBuilders.get(getEndpointFor(path, record.getId()));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(record)));
        verify(service, times(1)).find(path, record.getId());
    }

    @Test
    public void testFind_notFound() throws Exception {
        // Given
        var record = generator.generate();
        var id = record.getId();
        var path = record.toPath();
        Mockito.when(service.find(path, id))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get(getEndpointFor(path, id));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("record not found")));
        verify(service, times(1)).find(path, id);
    }

    @Test
    public void testCreate() throws Exception {
        // Given
        var newRecord = generator.generateNew();
        var path = newRecord.toPath();
        var createdRecord = generator.persist(newRecord);
        System.out.println(newRecord);
        Mockito.when(service.create(path, newRecord))
            .thenReturn(createdRecord);
        mockRelations(path, newRecord);

        // When
        var mockRequest = MockMvcRequestBuilders.post(getEndpointFor(path))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newRecord));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(createdRecord)));
        verify(service, times(1)).create(path, newRecord);
    }

    @Test
    public void testCreate_presetId() throws Exception {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setId(1L);
        var path = newRecord.toPath();
        mockRelations(path, newRecord);

        // When
        var mockRequest = MockMvcRequestBuilders.post(getEndpointFor(path))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newRecord));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("id must not be set"));
        verify(service, times(0)).create(any(), any());
    }

    @Test
    public void testUpdate() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        var updatedRecord = generator.copy(record);
        updatedRecord.setUpdatedAt(LocalDateTime.now());
        Mockito.when(service.update(path, record))
            .thenReturn(Optional.of(updatedRecord));
        mockRelations(path, record);

        // When
        var mockRequest = MockMvcRequestBuilders.put(getEndpointFor(path, record.getId()))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(updatedRecord)));
        verify(service, times(1)).update(path, record);
    }

    @Test
    public void testUpdate_idMismatch() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        mockRelations(path, record);

        // When
        var mockRequest = MockMvcRequestBuilders.put(getEndpointFor(path, generator.generateId()))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("id must be identical to url parameter"));
        verify(service, times(0)).update(path, record);
    }

    @Test
    public void testUpdate_notFound() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        Mockito.when(service.update(path, record))
            .thenReturn(Optional.empty());
        mockRelations(path, record);

        // When
        var mockRequest = MockMvcRequestBuilders.put(getEndpointFor(path, record.getId()))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("record not found"));
        verify(service, times(1)).update(path, record);
    }

    @Test
    public void testUpdate_conflict() throws Exception {
        // Given
        var record = generator.generate();
        var path = record.toPath();
        Mockito.when(service.update(path, record))
            .thenThrow(new UpdateConflictException("..."));
        mockRelations(path, record);

        // When
        var mockRequest = MockMvcRequestBuilders.put(getEndpointFor(path, record.getId()))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isPreconditionRequired())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message")
                .value("update conflict: the resource has already been modified"));
        verify(service, times(1)).update(path, record);
    }

    @Test
    public void testDelete() throws Exception {
        // Given
        var record = generator.generate();
        var id = record.getId();
        var path = record.toPath();
        Mockito.when(service.delete(path, id))
            .thenReturn(true);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete(getEndpointFor(path, id));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(jsonPath("$").doesNotExist());
        verify(service, times(1)).delete(path, id);
    }

    @Test
    public void testDelete_notFound() throws Exception {
        // Given
        var record = generator.generate();
        var id = record.getId();
        var path = record.toPath();
        Mockito.when(service.delete(path, id))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete(getEndpointFor(path, id));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("record not found"));
        verify(service, times(1)).delete(path, id);
    }

    protected abstract String getEndpointFor(TPath path);

    protected final String getEndpointFor(TPath path, Long id) {
        return getEndpointFor(path) + id;
    }

    protected abstract void mockRelations(TPath path, TModel record);

    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TService extends ModelService<TModel, EmptyPath>
        > extends ModelControllerTest<TModel, EmptyPath, TService> {
        @Override
        protected final void mockRelations(EmptyPath emptyPath, TModel record) {}
    }
}
