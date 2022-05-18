package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Vehicle} extends {@link ModelWithName}.
 * It provides basic fields, functionality and utilities of {@link ModelWithName}.
 */
@Entity
@Table(name = "vehicle")
public final class Vehicle extends ModelWithName {
}