package ch.rfobaden.incidentmanager.backend.models.paths;

import static org.assertj.core.api.Assertions.assertThat;

import ch.rfobaden.incidentmanager.backend.models.base.PojoTest;
import org.junit.jupiter.api.Test;

class EmptyPathTest extends PojoTest<EmptyPath> {
    @Override
    protected EmptyPath generate() {
        return EmptyPath.getInstance();
    }

    @Test
    void testGetInstance() {
        // When
        var a = EmptyPath.getInstance();
        var b = EmptyPath.getInstance();

        // Then
        assertThat(a).isSameAs(b);
    }
}
