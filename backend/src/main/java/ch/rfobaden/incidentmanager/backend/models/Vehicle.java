package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Vehicle} is a specific type with no additional fields or functionality.
 * It provides basic fields, functionality and utilities
 * of the extended base class {@link ModelWithName}.
 */
@Entity
@Table(name = "vehicle")
public final class Vehicle extends ModelWithName {
}