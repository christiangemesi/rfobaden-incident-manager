package ch.rfobaden.incidentmanager.backend.models;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * {@code Trailer} extends {@link ModelWithName}.
 * It provides basic fields, functionality and utilities of {@link ModelWithName}.
 */
@Entity
@Table(name = "trailer")
public class Trailer extends ModelWithName {}
