package ch.rfobaden.incidentmanager.backend.controllers.base;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Objects;

public abstract class ModelController<
    TModel extends Model,
    TService extends ModelService<TModel>
    > {

    protected final TService service;

    public ModelController(TService service) {
        this.service = service;
    }

    @GetMapping
    public List<TModel> list() {
        return service.list();
    }

    @GetMapping(value = "{id}")
    public TModel find(@PathVariable(value = "id") Long id) {
        return service.find(id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TModel create(@RequestBody TModel record) {
        if (record.getId() != null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "id must not be set");
        }
        return service.create(record);
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public TModel update(@PathVariable("id") Long id, @RequestBody TModel record) {
        if (!Objects.equals(record.getId(), id)) {
            throw new ApiException(
                HttpStatus.UNPROCESSABLE_ENTITY, "id must be identical to url parameter"
            );
        }
        return service.update(record).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        if (!service.delete(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "record not found");
        }
    }
}
