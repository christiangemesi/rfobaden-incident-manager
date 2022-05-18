package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Vehicle} extends {@link ModelWithName} that represents
 * a vehicle usable in a {@link Transport}.
 */
@Entity
@Table(name = "vehicle")
public final class Vehicle extends ModelWithName {
}