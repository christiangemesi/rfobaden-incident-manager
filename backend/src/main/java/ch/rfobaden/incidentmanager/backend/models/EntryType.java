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

/**
 * {@code EntryType} represents the type how a {@link Report} comes in and
 * how the reporter can be contacted.
 */
@Entity
@Table(name = "entry_type")
public class EntryType implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * The entry type id, unique to it's model.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    /**
     * The type a reporter comes in.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Source source;

    /**
     * The details a reporter can be reached.
     */
    @Size(min = 1, max = 100)
    private String descriptor;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public String getDescriptor() {
        return descriptor;
    }

    public void setDescriptor(String descriptor) {
        this.descriptor = descriptor;
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
            && source == that.source
            && Objects.equals(this.descriptor, that.descriptor
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(source, descriptor);
    }

    @Override
    public String toString() {
        return "EntryType{"
            + "id=" + id
            + ", source=" + source
            + ", descriptor='" + descriptor + '\''
            + '}';
    }

    /**
     * Types how a reporter can come in.
     */
    public enum Source {
        PHONE,
        EMAIL,
        RADIO,
        KP_FRONT,
        KP_BACK,
        REPORTER,
        FAX
    }
}
