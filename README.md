# Troto

Troto is a replacement for the protobuf compiler that can generate `.proto` files from TypeScript types as well as invoke any plugins without even needing protoc installed. This leads to a much better experience as TypeScript is much more powerful than the `.proto` language and allows automatic service `XxxRequest`/`XxxResponse` generation, generics, and much more.

# Usage

To use Troto, you need add it in your project using your favorite package manager. For example, with pnpm:

```shell
pnpm install troto
```

After this step, you will have the `trotoc` command available in your project. Next, you will need to create a compatible `tsconfig.json` file.

You can use the following example as a starting point:

```jsonc
{
	"compilerOptions": {
		"strict": true,
		"outDir": "./dist/proto",
		"types": ["troto/types"]
	}
}
```

All available options are:

```jsonc
{
	// TypeScript options
	"compilerOptions": {
		"strict": true,
		// Output directory for the generated .proto files
		"outDir": "./dist/proto",
		// Required to use the troto builtin types
		"types": ["troto/types"]
	},

	// Troto options
	"troto": {
		// Project-wide configuration of default file options
		"options": {
			// This will add `option objc_class_prefix = "TRO";`
			// to all generated .proto files
			"objc_class_prefix": "TRO"
		},
		// Language-specific package prefixes
		"packages": {
			"go": "github.com/yourname/yourproject"
		},

		// If set generates optional fields without the single-item oneof wrapper. Proto 3.15+.
		"optionals315": false,

		// Whether to generate .proto files, or just call the plugins
		"proto": true,

		// Ignore list for the packages you would like to skip emitting
		"ignore": ["google.protobuf"],

		// Plugins configuration
		"plugins": {
			// Invoke protoc-gen-gogofaster with:
			"gogofaster": {
				// Output directory for the generated .pb.go files
				"outDir": ".",
				// Plugin-specific options
				"paths": "source_relative",
				"plugins": "grpc"
			}
		}
	}
}
```

Once this is done, you can simply run `npx trotoc .` in your project directory to run the compiler.

Lets create an example to demonstrate how Troto works.

```typescript
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
```

This will generate the following `.proto` file:

```protobuf
// Code generated by Troto. DO NOT EDIT.
syntax = "proto3";
package test;
option java_multiple_files = true;
option cc_enable_arenas = true;
option optimize_for = 1;
option csharp_namespace = "Example.Test";
option java_package = "com.test";
option php_namespace = "Test";
option ruby_package = "Test";
option java_outer_classname = "SampleProto";
option php_metadata_namespace = "Test\PBMetadata";
option go_package = "test";
import "my/file.proto";
import "google/protobuf/struct.proto";
import "google/protobuf/timestamp.proto";
import "google/protobuf/any.proto";
message Vector3f {
	float x = 1;
	float y = 2;
	float z = 3;
}
message Vector3d {
	double x = 1;
	double y = 2;
	double z = 3;
}
message Vector3i {
	int32 x = 1;
	int32 y = 2;
	int32 z = 3;
}
message ComplexType {
	option a = "b";
	optional Vector3f opt1 = 1;
	optional Vector3d opt2 = 2;
	map<string, Vector3i> map1 = 3;
	repeated Vector3f rep1 = 4;
	repeated Vector3f rep2 = 5;
	Vector3f ext1 = 6 [y=4];
	bool b1 = 7;
	double b2 = 8;
	bytes b3 = 9;
	float b4 = 10;
	int32 b5 = 11;
	int64 b6 = 12;
	uint32 b7 = 13;
	uint64 b8 = 14;
	sint32 b9 = 15;
	sint64 b10 = 16;
	fixed32 b11 = 17;
	fixed64 b12 = 18;
	sfixed32 b13 = 19;
	sfixed64 b14 = 20;
	google.protobuf.Struct str = 21;
	google.protobuf.Timestamp date = 22;
	google.protobuf.Any any = 23;
	repeated google.protobuf.Any arr = 24;
	bytes bytes = 25;
	repeated uint32 u32 = 26;
}
service VectorService {
	rpc MulF32 (MulF32Request) returns (Vector3f);
	rpc MulF64 (MulF64Request) returns (Vector3d);
	rpc MulI32 (MulI32Request) returns (stream Vector3i);
}
message MulF32Request {
	Vector3f v = 1;
	float f = 2;
}
message MulF64Request {
	Vector3d v = 1;
	double d = 2;
}
message MulI32Request {
	Vector3i v = 1;
	int32 i = 2;
}
```

Neat, right? Now we can invoke code-generation plugins compatible with protoc protocol to generate code without emitting `.proto` files at all.

Let's modify the tsconfig.json file:

```jsonc
{
	"compilerOptions": {
		"strict": true,
		"skipLibCheck": true,
		"outDir": "./dist/proto",
		"types": ["troto/types"]
	},
	"troto": {
		"proto": false,
		"plugins": {
			"go": {
				"outDir": "./gen",
				"paths": "source_relative"
			}
		}
	}
}
```

After running the command below, we will have the `.go` files under the `./gen` directory.

```shell
npx trotoc .
```

You are now ready to use Troto in your project.

Enjoy generics, sum types, and much more in your project without losing any of the benefits of protobuf!
