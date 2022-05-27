package ch.rfobaden.incidentmanager.backend.models;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "document")
public class Document implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(nullable = false, unique = true)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String mimeType;

    private String extension;

    public Document() {
    }

    public Document(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String mimeTypeExtension) {
        this.extension = mimeTypeExtension;
    }

    @Override
    public String toString() {
        return "Document{"
            + "id=" + id
            + ", name='" + name + '\''
            + ", mimeType='" + mimeType + '\''
            + ", mimeTypeExtension'" + extension + '\''
            + '}';
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Document)) {
            return false;
        }
        Document document = (Document) other;
        return Objects.equals(id, document.id)
            && Objects.equals(name, document.name)
            && Objects.equals(mimeType, document.mimeType)
            && Objects.equals(extension, document.extension);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, mimeType, extension);
    }
}
