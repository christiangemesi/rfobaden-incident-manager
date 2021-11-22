package ch.rfobaden.incidentmanager.backend.services.base;

import ch.rfobaden.incidentmanager.backend.models.Model;

import java.util.List;
import java.util.Optional;

public interface ModelService<TModel extends Model> {
    public Optional<TModel> find(Long id);

    public List<TModel> list();

    public TModel create(TModel record);

    public Optional<TModel> update(TModel record);

    public boolean delete(Long id);
}
