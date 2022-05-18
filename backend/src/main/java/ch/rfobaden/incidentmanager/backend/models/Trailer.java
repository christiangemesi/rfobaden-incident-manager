package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Trailer} is a {@link ModelWithName} that represents a trailer usable in a {@link Transport}.
 */
@Entity
@Table(name = "trailer")
public class Trailer extends ModelWithName {
}
