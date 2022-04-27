package ch.rfobaden.incidentmanager.backend.models;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;


@Entity
@Table(name = "entry_type")
public class EntryType implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Size(min = 1, max = 100)
    private String number;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String nummer) {
        this.number = nummer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EntryType that = (EntryType) o;
        return Objects.equals(this.id, that.id)
            && type == that.type
            && Objects.equals(this.number, that.number
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, number);
    }

    @Override
    public String toString() {
        return "EntryType{"
            + "id=" + id
            + ", type=" + type
            + ", number='" + number + '\''
            + '}';
    }

    public enum Type {
        TELEFON,
        EMAIL,
        FUNK,
        KP_FRONT,
        KP_RUECK,
        MELDELAUUFER,
        FAX
    }
}
