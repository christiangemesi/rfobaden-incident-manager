package ch.rfobaden.incidentmanager.backend.controllers.base;

import ch.rfobaden.incidentmanager.backend.errors.ApiException;
import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
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
    TModel extends Model,
    TPath,
    TService extends ModelService<TModel, TPath>
    > extends AppController {

    @Autowired
    protected TService service;

    protected abstract void loadPath(TPath path, TModel record);

    @GetMapping
    public List<TModel> list(@ModelAttribute TPath path) {
        return service.list(path);
    }

    @GetMapping(value = "{id}")
    public TModel find(@ModelAttribute TPath path, @PathVariable(value = "id") Long id) {
        return service.find(path, id).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TModel create(@ModelAttribute TPath path, @RequestBody TModel record) {
        if (record.getId() != null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "id must not be set");
        }
        loadPath(path, record);
        return service.create(path, record).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "not found")
        ));
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.OK)
    public TModel update(
        @ModelAttribute TPath path,
        @PathVariable("id") Long id,
        @RequestBody TModel record
    ) {
        if (!Objects.equals(record.getId(), id)) {
            throw new ApiException(
                HttpStatus.UNPROCESSABLE_ENTITY, "id must be identical to url parameter"
            );
        }
        loadPath(path, record);
        return service.update(path, record).orElseThrow(() -> (
            new ApiException(HttpStatus.NOT_FOUND, "record not found")
        ));
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@ModelAttribute TPath path,@PathVariable("id") Long id) {
        if (!service.delete(path, id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "record not found");
        }
    }

    public abstract static class Basic<
        TModel extends Model,
        TService extends ModelService<TModel, EmptyPath>
        > extends ModelController<TModel, EmptyPath, TService> {
        @Override
        protected final void loadPath(EmptyPath emptyPath, TModel record) {}
    }
}
