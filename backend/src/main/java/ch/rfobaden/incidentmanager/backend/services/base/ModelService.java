package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.models.Model;

import java.util.List;
import java.util.Optional;

public interface ModelService<TModel extends Model, TPath> {
    public Optional<TModel> find(Long id);

    public Optional<TModel> find(TPath path, Long id);

    public List<TModel> list(TPath path);

    public Optional<TModel> create(TPath path, TModel entity);

    public Optional<TModel> update(TPath path, TModel entity);

    public boolean delete(TPath path, Long id);
}
