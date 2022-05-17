package ch.rfobaden.incidentmanager.backend.models;

import ch.rfobaden.incidentmanager.backend.models.paths.EmptyPath;
import ch.rfobaden.incidentmanager.backend.models.paths.PathConvertible;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

/**
 * {@code Model} is the base class for types class representing database entities.
 * It provides basic fields, functionality and utilities for such types.
 * <p>
 *     Not <i>every</i> model type has to extend {@code Model}.
 *     If you're unsure of whether it is correct to do so, it probably is.
 * </p>
 */
@MappedSuperclass
public abstract class Model {
    /**
     * The entities' id, unique to it's model.
     */
    @Id
    @GeneratedValue
    @Column(nullable = false, unique = true)
    private Long id;

    /**
     * The moment in time at which this entity was created.
     * This value should not be changed after first saving the entity.
     */
    @NotNull
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * The moment in time at which this entity was last changed.
     * This value should be changed before every save.
     */
    @NotNull
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public abstract boolean equals(Object other);

    /**
     * Compares the fields of two {@link Model} instances.
     * <p>
     *     This is a utility method meant to be used in implementations of {@link #equals(Object)}.
     *     It can be called after ensuring that the other object is a {@code Model},
     *     and before comparing your own column fields.
     * </p>
     *
     * @param that The other model.
     * @return Whether the {@code Model} fields of {@code this} and {@code that} are equal.
     */
    protected final boolean equalsModel(Model that) {
        return Objects.equals(id, that.id)
            && Objects.equals(createdAt, that.createdAt)
            && Objects.equals(updatedAt, that.updatedAt);
    }

    @Override
    public abstract int hashCode();

    /**
     * Computes a hashCode over the {@link Model} fields of this entity.
     *
     * @return The computed code.
     */
    protected final int modelHashCode() {
        return Objects.hash(id, createdAt, updatedAt);
    }

    /**
     * Generates a string representation of this entity,
     * containing all of its database fields and many-to-one relations.
     *
     * @return The string representation.
     */
    @Override
    public final String toString() {
        return new Stringifier(this).getString();
    }

    /**
     * {@code Model.Basic} is a specialization of {@link Model}.
     * It implements {@link PathConvertible} with {@link EmptyPath}.
     */
    @MappedSuperclass
    public abstract static class Basic extends Model implements PathConvertible<EmptyPath> {
        @Override
        public final EmptyPath toPath() {
            return EmptyPath.getInstance();
        }
    }

    /**
     * {@code Stringifier} allows stringification of any {@link Model} type.
     */
    private static final class Stringifier {
        /**
         * The model entity to be stringified.
         */
        private final Model entity;

        /**
         * The {@code StringBuilder} into which the stringified output is written.
         */
        private final StringBuilder builder;

        /**
         * The class of the {@link #entity}.
         */
        private final Class<? extends Model> clazz;

        /**
         * Creates a new {@link Stringifier} which creates a {@link String} from {@code entity}.
         *
         * @param entity The {@code Model} instance to stringify.
         */
        private Stringifier(Model entity) {
            this.entity = entity;
            this.clazz = entity.getClass();
            this.builder = new StringBuilder();
            this.build();
        }

        /**
         * Get the result of this {@link Stringifier}.
         *
         * @return The result.
         */
        public String getString() {
            return builder.toString();
        }

        /**
         * Writes the string representation of {@link #entity} into {@link #builder}.
         */
        private void build() {
            builder
                .append(clazz.getSimpleName())
                .append('(')
                .append("id: ")
                .append(entity.getId());

            for (var field : clazz.getDeclaredFields()) {
                insertField(field);
            }

            builder
                .append(", createdAt: ")
                .append(entity.getCreatedAt())
                .append(", updatedAt: ")
                .append(entity.getUpdatedAt())
                .append(')');
        }

        /**
         * Writes a {@link Field} into {@link #builder}.
         *
         * @param field The field to be inserted.
         */
        private void insertField(Field field) {
            try {
                if (Modifier.isStatic(field.getModifiers())) {
                    return;
                }

                var getter = findGetter(field.getName());
                if (getter == null) {
                    return;
                }
                var value = getter.invoke(entity);
                builder.append(", ");

                if (Model.class.isAssignableFrom(field.getType())) {
                    insertModelField(field, (Model) value);
                    return;
                }
                if (Collection.class.isAssignableFrom(field.getType())) {
                    insertCollectionField(field, (Collection<?>) value);
                    return;
                }
                insertNormalField(field, value);
            } catch (IllegalAccessException | InvocationTargetException e) {
                throw new IllegalStateException("failed to insert field", e);
            }
        }

        /**
         * Inserts the name and value of a field into {@link #builder}.
         * The field's value is stringified using {@link Object#toString()}.
         *
         * @param field The field to be inserted.
         * @param value The field's value.
         */
        private void insertNormalField(Field field, Object value) {
            builder.append(field.getName()).append(": ").append(value);
        }

        /**
         * Inserts the name and value of a field into {@link #builder}.
         * The value needs to be a {@link Model}.
         * <p>
         *     If the field is annotated with {@link JoinColumn},
         *     the value is stringified using {@link Object#toString()}.
         *     Otherwise, only the id of the value is inserted.
         * </p>
         *
         * @param field The field to be inserted.
         * @param value The field's value.
         */
        private void insertModelField(Field field, Model value) {
            builder.append(field.getName());
            if (field.isAnnotationPresent(JoinColumn.class)) {
                builder.append(": ").append(value);
            } else {
                builder.append("Id").append(": ").append(
                    value == null ? "null" : value.getId()
                );
            }
        }

        /**
         * Inserts the name and value of a field into {@link #builder}.
         * The value needs to be a {@link Collection}.
         *
         * @param field The field to be inserted.
         * @param value The field's value.
         */
        private void insertCollectionField(Field field, Collection<?> value) {
            var oneToManyAnnotation = field.getAnnotation(OneToMany.class);
            if (oneToManyAnnotation != null && oneToManyAnnotation.fetch() == FetchType.LAZY) {
                return;
            }

            var type = (ParameterizedType) field.getGenericType();
            var elementType = type.getActualTypeArguments()[0];
            if (!(elementType instanceof Class)) {
                throw new UnsupportedOperationException(
                    "unable to automatically format field " + field.getName()
                );
            }
            var elementClass = (Class<?>) elementType;
            if (Model.class.isAssignableFrom(elementClass)) {
                @SuppressWarnings("unchecked")
                var modelCollection = (Collection<Model>) value;
                builder.append(field.getName()).append("Ids").append(": ").append(
                    modelCollection == null ? "null" : modelCollection.stream()
                        .map(element -> {
                            var entityId = element.getId();
                            if (entityId == null) {
                                return "null";
                            }
                            return entityId.toString();
                        })
                        .collect(Collectors.joining(", ", "[", "]"))
                );
            } else {
                insertNormalField(field, value);
            }
        }

        /**
         * Attemps to find the getter method for a specific field.
         *
         * @param fieldName The name of the field to search for.
         * @return The field's getter, or {@code null}, if none was found.
         */
        private Method findGetter(String fieldName) {
            try {
                var getter = clazz.getMethod(
                    "get" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1)
                );
                if (getter.getParameterCount() != 0 || !Modifier.isPublic(getter.getModifiers())) {
                    return null;
                }
                return getter;
            } catch (NoSuchMethodException e) {
                return null;
            }
        }
    }
}
