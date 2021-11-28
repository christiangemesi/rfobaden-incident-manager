package ch.rfobaden.incidentmanager.backend.repos.base;

import ch.rfobaden.incidentmanager.backend.models.Model;
import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ModelRepository<TModel extends Model & PathConvertible<TPath>, TPath> {
    boolean existsByPath(TPath path, Long id);

    Optional<TModel> findByPath(TPath path, Long id);

    List<TModel> findAllByPath(TPath path);

    interface Basic<TModel extends Model & PathConvertible<EmptyPath>> extends ModelRepository<TModel, EmptyPath> {
        @Override
        default boolean existsByPath(EmptyPath path, Long id) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.existsById(id);
        }

        @Override
        @Query
        default Optional<TModel> findByPath(EmptyPath path, Long id) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.findById(id);
        }

        @Override
        default List<TModel> findAllByPath(EmptyPath path) {
            @SuppressWarnings("unchecked")
            var repo = ((JpaRepository<TModel, Long>) this);
            return repo.findAll();
        }
    }
}
