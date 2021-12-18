package ch.rfobaden.incidentmanager.backend.controllers.base;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import ch.rfobaden.incidentmanager.backend.services.base.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Objects;

public abstract class ModelController<
    TModel extends Model & PathConvertible<TPath>,
    TPath,
    TService extends ModelService<TModel, TPath>
    > extends AppController {
    private static final String RECORD_NOT_FOUND_MESSAGE = "record not found";

    @Autowired
    protected TService service;

    protected abstract void loadRelations(TPath path, TModel entity);

    @GetMapping
    public List<TModel> list(@ModelAttribute TPath path) {
        return service.list(path);
    }

    @GetMapping(value = "{id}")
    public TModel find(@ModelAttribute TPath path, @PathVariable(value = "id") Long id) {
        return service.find(path, id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE)
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TModel create(@ModelAttribute TPath path, @RequestBody TModel entity) {
        if (entity.getId() != null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "id must not be set");
        }
        loadRelations(path, entity);
        return service.create(path, entity);
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public TModel update(
        @ModelAttribute TPath path,
        @PathVariable("id") Long id,
        @RequestBody TModel entity
    ) {
        if (!Objects.equals(entity.getId(), id)) {
            throw new ApiException(
                HttpStatus.UNPROCESSABLE_ENTITY, "id must be identical to url parameter"
            );
        }
        loadRelations(path, entity);
        return service.update(path, entity).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE)
        ));
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@ModelAttribute TPath path, @PathVariable("id") Long id) {
        if (!service.delete(path, id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, RECORD_NOT_FOUND_MESSAGE);
        }
    }

    public abstract static class Basic<
        TModel extends Model & PathConvertible<EmptyPath>,
        TService extends ModelService<TModel, EmptyPath>
        > extends ModelController<TModel, EmptyPath, TService> {
        @Override
        protected void loadRelations(EmptyPath emptyPath, TModel entity) {}
    }
}
