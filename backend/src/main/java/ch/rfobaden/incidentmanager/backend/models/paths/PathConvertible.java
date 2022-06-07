package ch.rfobaden.incidentmanager.backend.models.paths;

import ch.rfobaden.incidentmanager.backend.models.Model;

/**
 * {@code PathConvertible} represents an entity that can be found under a specific path.
 * The variable elements of that path are stored in the {@link TPath} type parameter.
 * <p>
 *   Note that although the path specifies where an entity can be found,
 *   the {@link TPath} does not uniquely identify the entity itself -
 *   that is what the {@link Model#getId() id} is for.
 *   Rather than that, the path groups entities together that can be found at the same location.
 * </p>
 *
 * @param <TPath> The type containing the variable parts of the path.
 */
public interface PathConvertible<TPath> {
    /**
     * Creates a path under which this entity can be found.
     *
     * @return The entities' path.
     */
    TPath toPath();
}
