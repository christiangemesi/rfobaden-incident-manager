package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@MappedSuperclass
public abstract class ModelWithName extends Model.Basic {
    @Size(max = 100)
    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull
    @Column(nullable = false)
    private boolean isVisible;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("isVisible")
    public boolean isVisible() {
        return isVisible;
    }

    public void setVisible(boolean visible) {
        isVisible = visible;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof ModelWithName)) {
            return false;
        }
        var that = (ModelWithName) other;
        return equalsModel(that)
            && Objects.equals(name.toLowerCase(), that.name.toLowerCase())
            && isVisible == that.isVisible;
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name.toLowerCase(), isVisible);
    }

}
