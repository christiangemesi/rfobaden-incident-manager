package ch.rfobaden.incidentmanager.backend.models.paths;

import com.fasterxml.jackson.annotation.JsonCreator;

public final class EmptyPath {
    private static final EmptyPath instance = new EmptyPath();

    @JsonCreator
    public static EmptyPath getInstance() {
        return instance;
    }

    private EmptyPath() {}

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
