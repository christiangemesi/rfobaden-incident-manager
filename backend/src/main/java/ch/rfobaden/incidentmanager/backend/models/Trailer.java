package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Trailer} is a {@link ModelWithName} that can be chosen
 * as a vehicle trailer in a {@link Transport}.
 */
@Entity
@Table(name = "trailer")
public class Trailer extends ModelWithName {
}
