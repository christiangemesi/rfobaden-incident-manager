package ch.rfobaden.incidentmanager.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "vehicle")
public final class Vehicle extends Model.Basic implements Serializable {
    private static final long serialVersionUID = 1L;

    @Size(max = 100)
    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private boolean isVisible;

    public String getName() {
        return name;
    }

    public void setName(String organizationName) {
        this.name = organizationName;
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
        if (!(other instanceof Vehicle)) {
            return false;
        }
        var that = (Vehicle) other;
        return equalsModel(that)
            && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(modelHashCode(), name);
    }
}
