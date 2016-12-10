# Jackson Annotations

This page lists all general-purpose Jackson 2.0 annotations, grouped by functionality.

For older (Jackson 1.x) annotations, refer to [FasterXML Wiki](http://wiki.fasterxml.com/JacksonAnnotations).

All annotations include a brief explanation, and (in near future!) a link to full explanation with basic usage examples.

**NOTE**: Contributions welcome!!!

### Property Naming

* `@JsonProperty` (also indicates that property is to be included) is used to indicate external property name, name used in data format (JSON or one of other supported data formats)
    * `@JsonProperty.value`: name to use
    * `@JsonProperty.index`: physical index to use, if dataformat (other than JSON) is index-based
    * `@JsonProperty.defaultValue`: textual default value defined as metadata. **NOTE**: core databind does NOT make any use of this value; it is currently only exposed to extension modules.

### Property Inclusion

* `@JsonAutoDetect`: class annotation used for overriding property introspection definitions
* `@JsonIgnore`: simple annotation to use for ignoring specified properties:
    * Only needs to be added to one of accessors/mutators (field, getter/setter, constructor parameter), but will have effect on the "whole" property: that is, adding annotation to a "getter" will also disable "setter"
        * ... unless "setter" has `@JsonProperty`, in which case this is considered a "split property" with enabled "setter" but no "getter" ("read-only", so that property may be read from input, but is not written output)
* `@JsonIgnoreProperties`: per-class annotation to list properties to ignore, or to indicate that any unknown properties are to be ignored.
    * On serialization, ```@JsonIgnoreProperties({"prop1", "prop2"})``` ignores listed properties
    * On deserialization, ```@JsonIgnoreProperties(ignoreUnknown=true)``` ignores properties that don't have getter/setters
* `@JsonIgnoreType`: per-class annotation to indicate that all properties of annotated type are to be ignored.
* `@JsonInclude`: annotation used to define if certain "non-values" (nulls or empty values) should not be included when serializing; can be used on per-property basis as well as default for a class (to be used for all properties of a class)

### Property documentation, metadata

* `@JsonPropertyDescription` (added in 2.3): Annotation used to define a human readable description for a logical property.
    * Not use by core databinding, but is used by [JSON Schema generator](../../jackson-module-jsonSchema) for adding description in schema.

### Deserialization and Serialization details

* `@JsonFormat`: general annotation that has per-type behavior; can be used for example to specify format to use when serializing Date/Time values.
* `@JsonUnwrapped`: property annotation used to define that value should be "unwrapped" when serialized (and wrapped again when deserializing), resulting in flattening of data structure, compared to POJO structure.
* `@JsonView`: property annotation used for defining View(s) in which property will be included for serialization, deserialization.

### Deserialization details

* `@JacksonInject`: annotation to indicate that property should get its value via "injection", and not from data (JSON).
* `@JsonAnySetter`: annotation used for defining a two-argument method as "any setter", used for deserializing values of otherwise unmapped JSON properties
* `@JsonCreator`: annotation used for indicating that a constructor or static factory method should be used for creating value instances during deserialization.
* `@JsonSetter`: alternative to @JsonProperty, for marking that specified method is a "setter-method"
* `@JsonEnumDefaultValue` (added in 2.8): annotation used for defining a default value when deserializing unknown Enum values. Requires config `READ_UNKNOWN_ENUM_VALUES_USING_DEFAULT_VALUE` feature to be enabled. See example snippet in [Deserialization Features](https://github.com/FasterXML/jackson-databind/wiki/Deserialization-Features#value-conversions-coercion)

### Serialization details

* `@JsonAnyGetter`: annotation used to define a getter as "any getter", which returns a `java.util.Map`, contents of which will be serialized as additional properties for JSON Object, along with regular properties that the Object may have.
* `@JsonGetter`: alternative to @JsonProperty, for marking that specified method is a "getter-method"
* `@JsonPropertyOrder`: annotation for specifying order in which properties are serialized
* `@JsonRawValue`: per-property marker that can be used to specify that the value of property is to be included in serialization ''exactly'' as is, with no escaping or decoration -- useful for embedding pre-serialized JSON (or whatever data format is being used) in output
* `@JsonValue`: per-property marker to indicate that the POJO should serialization is to be done using value of the property, often a `java.lang.String` (like annotation `toString()` method)
* `@JsonRootName`: class annotation used to indicate name of "wrapper" entry used for root value,  if root-wrapping is enabled

### Type handling

* `@JsonSubTypes`: class annotation used to indicate sub-types of annotated type; necessary when deserializing polymorphic types using logical type names (and not class names)
* `@JsonTypeId`: property annotation used to indicate that the property value should be used as the `Type Id` for object, instead of using class name or external type name.
* `@JsonTypeInfo`: class/property annotation used to indicate details of what type information is included in serialization, as well as how.
* `@JsonTypeName`: class annotation used to define logical type name to use for annotated class; type name can be used as `Type Id` (depending on settings of `@JsonTypeInfo`)

### Object references, identity

* `@JsonManagedReference`, `@JsonBackReference`: pair of annotations used to indicate and handle parent/child relationships expressed with pair of matching properties
* `@JsonIdentityInfo`: class/property annotation used to indicate that `Object Identity` is to be used when serializing/deserializing values, such that multiple references to a single Java Object can be properly deserialized. This can be used to properly deal with cyclic object graphs and directed-acyclic graphs.

### Meta-annotations

This group includes annotations used on other annotations.

* `@JacksonAnnotation`: marker annotation added to all Jackson-defined annotations (which includes all other annotations contained in this package)
* `@JacksonAnnotationsInside`: marked annotation used to indicate that a custom annotation contains Jackson annotations; used to allow "annotation bundles", custom annotations that are annotated with Jackson annotations (why? to allow adding just a single annotation to represent set of multiple Jackson annotations)

## Use with JAX-RS (DropWizard, Jersey)

Although value annotations are usable anywhere Jackson itself is, without extra work, there are some additional things to consider when using Jackson on a JAX-RS container.
Such containers require use of [Jackson JAX-RS provider](../../jackson-jaxrs-providers) (or equivalent implementation of bit of glue to register Jackson for converting content between external format like JSON, and POJOs).

One specific limitation is that although Jackson can introspect annotations from within values it is passed, it does not have direct access to annotations on Resource Methods. Provider is handed these definitions, however, and it can use some of the annotations.

For more information, check out [JAX-RS provider wiki](../../jackson-jaxrs-providers/wiki), but short story is that following annotations are supported to some degree:

* `@JsonView`: applicable for both return value (method annotation) and input argument(s) (parameter annotation)
* `@JsonRootName`: similar applicable to return and input value(s).
* `@JacksonAnnotationsInside`: fully supported so you can create and use "annotation bundles"
* `@JacksonFeature`: JAX-RS provider specific annotation (not included in `jackson-annotations`) allows enabling/disabling `SerializationFeature`s and `DeserializationFeature`s for the endpoint

also note that annotations are NOT shared (that is, deserializer is NOT passed method annotations; nor is serializer passed parameter annotations), so in some cases you may need to violate DRY principle and add duplicate annotations

## Related

It is also possible to use [JAXB annotations](https://github.com/FasterXML/jackson-module-jaxb-annotations) in addition to or instead of these core annotations.
