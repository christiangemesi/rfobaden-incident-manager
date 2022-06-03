package ch.rfobaden.incidentmanager.backend.models.paths;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * {@code EmptyPath} is a path with no variable parts.
 * It is used by entities that cannot be grouped under anything.
 * <p>
 *     Note that although this class is build like a singleton,
 *     it does not guarantee that only one instance of it can exist - its constructor is public.
 *     The reason for this is that some parts of the Spring request and response serialization
 *     may sometimes require access to a public, non-parameterized constructor.
 * </p>
 *
 * @see PathConvertible
 */
public class EmptyPath {
    /**
     * The shared {@link EmptyPath} instance.
     */
    private static final EmptyPath instance = new EmptyPath();

    /**
     * Get the shared {@link EmptyPath} instance.
     *
     * @return The shared instance.
     */
    @JsonCreator
    public static EmptyPath getInstance() {
        return instance;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof EmptyPath;
    }

    @Override
    public int hashCode() {
        return 1;
    }

    @Override
    public String toString() {
        return "EmptyPath";
    }
}
