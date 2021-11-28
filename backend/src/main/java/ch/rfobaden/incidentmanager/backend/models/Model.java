package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Model {
    @Id
    @GeneratedValue
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public abstract boolean equals(Object other);

    protected final boolean equalsModel(Model that) {
        return Objects.equals(id, that.id)
            && Objects.equals(createdAt, that.createdAt)
            && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public abstract int hashCode();

    protected final int modelHashCode() {
        return Objects.hash(id, createdAt, updatedAt);
    }

    @Override
    public abstract String toString();

    @MappedSuperclass
    public abstract static class Basic extends Model implements PathConvertible<EmptyPath> {
        @Override
        public final EmptyPath toPath() {
            return EmptyPath.getInstance();
        }
    }
}
