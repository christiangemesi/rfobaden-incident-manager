package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;

import java.util.List;
import java.util.Optional;

public interface ModelService<TModel extends Model & PathConvertible<TPath>, TPath> {
    Optional<TModel> find(Long id);

    Optional<TModel> find(TPath path, Long id);

    List<TModel> list(TPath path);

    TModel create(TPath path, TModel entity);

    default TModel create(TModel entity) {
        return create(entity.toPath(), entity);
    }

    Optional<TModel> update(TPath path, TModel entity);

    default Optional<TModel> update(TModel entity) {
        return update(entity.toPath(), entity);
    }

    boolean delete(TPath path, Long id);

    default boolean delete(TModel entity) {
        return delete(entity.toPath(), entity.getId());
    }
}
