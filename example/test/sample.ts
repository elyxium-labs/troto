// Non-exported types are not emitted
interface Vector3<T> {
	x$1: T; // $ suffix sets the field number
	y$2: T;
	z: T; // Default field number is the field order
}

// Exported interfaces with no methods are emitted as messages
export interface Vector3f extends Vector3<float> {}
export interface Vector3d extends Vector3<double> {}
export interface Vector3i extends Vector3<int32> {}

// Importing works as expected, google types are provided by troto
import { Struct } from 'troto/types/google/protobuf/struct';

// You can also force an import by prefixing with '?'
import '?my/file.proto';

// This will add `option a = "b";` to the generated definition of ComplexType
/*** @option a=b */
export interface ComplexType {
	opt1?: Vector3f; // Optional fields are emitted as optional
	opt2: Opt<Vector3d>; // Opt<> can also be used to make fields optional

	map1: Map<string, Vector3i>; // Map<> can be used to define map fields

	rep1: Rep<Vector3f>; // Rep<> can be used to define repeated fields
	rep2: Vector3f[]; // This is equivalent to Rep<Vector3f>

	ext1: Ext<Vector3f, { y: 4 }>; // Ext<> can be used to define options for fields

	union: { f: Vector3f } | { d: Vector3d }; // Unions are emitted as oneof

	// All primitive types are supported with their own names
	b1: bool;
	b2: double;
	b3: bytes;
	b4: float;
	b5: int32;
	b6: int64;
	b7: uint32;
	b8: uint64;
	b9: sint32;
	b10: sint64;
	b11: fixed32;
	b12: fixed64;
	b13: sfixed32;
	b14: sfixed64;
	str: Struct;

	// Javascript types map to protobuf types as well.
	date: Date; // google.protobuf.Timestamp
	any: any; // google.protobuf.Any
	arr: Array<any>; // repeated google.protobuf.Any
	bytes: ArrayBuffer; // bytes
	u32: Uint32Array; // repeated uint32
}

// Type aliases are not emitted either, exported or not. They are for your
// internal use across different files
export type Test = {
	z: 4;
};

// You can also set file options via the FileOpt function
FileOpt('csharp_namespace', 'Example.Test');

// Exported interfaces with methods are emitted as services
export interface VectorService {
	// If the method has multiple arguments, they are wrapped in a request message
	// If the arguments / return types are empty, it will use google.protobuf.Empty
	MulF32(v: Vector3f, f: float): Vector3f;
	MulF64(v: Vector3d, d: double): Vector3d;
	MulI32(v: Vector3i, i: int32): Stream<Vector3i>; // Stream<> can be used to define streaming methods
}
