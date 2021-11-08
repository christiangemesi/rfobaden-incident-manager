package ch.rfobaden.incidentmanager.backend.controllers.base;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.rfobaden.incidentmanager.backend.TestConfig;
import ch.rfobaden.incidentmanager.backend.errors.UpdateConflictException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import ch.rfobaden.incidentmanager.backend.test.generators.base.ModelGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Import(TestConfig.class)
public abstract class ModelControllerTest<
    TModel extends Model,
    TService extends ModelService<TModel>
    > {
    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected TService service;

    @Autowired
    protected Faker faker;

    @Autowired
    protected ModelGenerator<TModel> generator;

    protected ObjectMapper mapper = Jackson2ObjectMapperBuilder.json().build();

    private final String basePath;

    protected ModelControllerTest(String basePath) {
        if (!basePath.endsWith("/")) {
            throw new IllegalArgumentException("basePath has to end with '/'");
        }
        this.basePath = basePath;
    }

    @Test
    public void testList() throws Exception {
        // Given
        var records = generator.generateNew(10);
        Mockito.when(service.list())
            .thenReturn(records);

        // When
        var request = MockMvcRequestBuilders.get(basePath);

        // Then
        mockMvc.perform(request)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(records)));
        verify(service, times(1)).list();
    }


    @Test
    public void testList_empty() throws Exception {
        // Given
        Mockito.when(service.list())
            .thenReturn(List.of());

        // When
        var mockRequest = MockMvcRequestBuilders.get(basePath);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
        verify(service, times(1)).list();
    }

    @Test
    public void testFind() throws Exception {
        // Given
        var record = generator.generatePersisted();
        Mockito.when(service.find(record.getId()))
            .thenReturn(Optional.of(record));

        // When
        var mockRequest = MockMvcRequestBuilders.get(basePath + record.getId());

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(record)));
        verify(service, times(1)).find(record.getId());
    }

    @Test
    public void testFind_notFound() throws Exception {
        // Given
        var id = faker.random().nextLong();
        Mockito.when(service.find(id))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.get(basePath + id);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message", is("record not found")));
        verify(service, times(1)).find(id);
    }

    @Test
    public void testCreate() throws Exception {
        // Given
        var newRecord = generator.generateNew();
        var createdRecord = generator.persist(newRecord);
        Mockito.when(service.create(newRecord))
            .thenReturn(createdRecord);

        // When
        var mockRequest = MockMvcRequestBuilders.post(basePath)
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newRecord));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(createdRecord)));
        verify(service, times(1)).create(newRecord);
    }

    @Test
    public void testCreate_presetId() throws Exception {
        // Given
        var newRecord = generator.generateNew();
        newRecord.setId(1L);

        // When
        var mockRequest = MockMvcRequestBuilders.post(basePath)
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(newRecord));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("id must not be set"));
        verify(service, times(0)).create(any());
    }

    @Test
    public void testUpdate() throws Exception {
        // Given
        var record = generator.generatePersisted();
        var updatedRecord = generator.copy(record);
        updatedRecord.setUpdatedAt(LocalDateTime.now());
        Mockito.when(service.update(record))
            .thenReturn(Optional.of(updatedRecord));

        // When
        var mockRequest = MockMvcRequestBuilders.put(basePath + record.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").exists())
            .andExpect(content().json(mapper.writeValueAsString(updatedRecord)));
        verify(service, times(1)).update(record);
    }

    @Test
    public void testUpdate_idMismatch() throws Exception {
        // Given
        var record = generator.generatePersisted();

        // When
        var mockRequest = MockMvcRequestBuilders.put(basePath + faker.random().nextLong())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("id must be identical to url parameter"));
        verify(service, times(0)).update(record);
    }

    @Test
    public void testUpdate_notFound() throws Exception {
        // Given
        var record = generator.generatePersisted();
        Mockito.when(service.update(record))
            .thenReturn(Optional.empty());

        // When
        var mockRequest = MockMvcRequestBuilders.put(basePath + record.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("record not found"));
        verify(service, times(1)).update(record);
    }

    @Test
    public void testUpdate_conflict() throws Exception {
        // Given
        var record = generator.generatePersisted();
        Mockito.when(service.update(record))
            .thenThrow(new UpdateConflictException("..."));

        // When
        var mockRequest = MockMvcRequestBuilders.put(basePath + record.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(record));

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isPreconditionRequired())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("update conflict: the resource has already been modified"));
        verify(service, times(1)).update(record);
    }

    @Test
    public void testDelete() throws Exception {
        // Given
        var id = generator.generatePersisted().getId();
        Mockito.when(service.delete(id))
            .thenReturn(true);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete(basePath + id);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNoContent())
            .andExpect(jsonPath("$").doesNotExist());
        verify(service, times(1)).delete(id);
    }

    @Test
    public void testDelete_notFound() throws Exception {
        // Given
        var id = generator.generatePersisted().getId();
        Mockito.when(service.delete(id))
            .thenReturn(false);

        // When
        MockHttpServletRequestBuilder mockRequest =
            MockMvcRequestBuilders.delete(basePath + id);

        // Then
        mockMvc.perform(mockRequest)
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$").exists())
            .andExpect(jsonPath("$.message").value("record not found"));
        verify(service, times(1)).delete(id);
    }
}
