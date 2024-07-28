// abi's for dojo 0.6.1.alpha-4
// models for pixelaw 0.2.0

export default function (worldAddress: string) {
    return {
        contracts: [],
        models: [
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "system",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "name",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "manifest",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "icon",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "action",
                        type: "felt252",
                        key: false,
                    },
                ],
                class_hash: "0x61d63e9820c3bb851a3d1d83a33376c75c60bbd054f5961fa6f7ee2325ee4da",
                original_class_hash: "0x61d63e9820c3bb851a3d1d83a33376c75c60bbd054f5961fa6f7ee2325ee4da",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "appImpl",
                        interface_name: "pixelaw::core::models::registry::Iapp",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::registry::App",
                        members: [
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "manifest",
                                type: "core::felt252",
                            },
                            {
                                name: "icon",
                                type: "core::felt252",
                            },
                            {
                                name: "action",
                                type: "core::felt252",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::registry::Iapp",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::registry::App",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::registry::app::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-App",
                manifest_name: "pixelaw-App-36504565",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "name",
                        type: "felt252",
                        key: true,
                    },
                    {
                        name: "system",
                        type: "ContractAddress",
                        key: false,
                    },
                ],
                class_hash: "0x1d25ed33e9de78fb38e35801c6961e36d09509fd814aa53a68c33a65cabcdb4",
                original_class_hash: "0x1d25ed33e9de78fb38e35801c6961e36d09509fd814aa53a68c33a65cabcdb4",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "app_nameImpl",
                        interface_name: "pixelaw::core::models::registry::Iapp_name",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::registry::AppName",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::registry::Iapp_name",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::registry::AppName",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::registry::app_name::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-AppName",
                manifest_name: "pixelaw-AppName-3b816829",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "system",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "player",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "action",
                        type: "felt252",
                        key: false,
                    },
                ],
                class_hash: "0x598be6fbed3cbe52f24ab76412e3348f1195f65bbf06876976ac47d9fdaf99d",
                original_class_hash: "0x598be6fbed3cbe52f24ab76412e3348f1195f65bbf06876976ac47d9fdaf99d",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "app_userImpl",
                        interface_name: "pixelaw::core::models::registry::Iapp_user",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::registry::AppUser",
                        members: [
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "player",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "action",
                                type: "core::felt252",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::registry::Iapp_user",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::registry::AppUser",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::registry::app_user::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-AppUser",
                manifest_name: "pixelaw-AppUser-4eda3c52",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "key",
                        type: "felt252",
                        key: true,
                    },
                    {
                        name: "value",
                        type: "ContractAddress",
                        key: false,
                    },
                ],
                class_hash: "0x57c9ff67a9593c2e41230647fc6c06df149b9e1f135335c5c657f5ccd25a9aa",
                original_class_hash: "0x57c9ff67a9593c2e41230647fc6c06df149b9e1f135335c5c657f5ccd25a9aa",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "core_actions_addressImpl",
                        interface_name: "pixelaw::core::models::registry::Icore_actions_address",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::registry::CoreActionsAddress",
                        members: [
                            {
                                name: "key",
                                type: "core::felt252",
                            },
                            {
                                name: "value",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::registry::Icore_actions_address",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::registry::CoreActionsAddress",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::registry::core_actions_address::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-CoreActionsAddress",
                manifest_name: "pixelaw-CoreActionsAddress-5379e1ce",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "system",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "selector",
                        type: "felt252",
                        key: true,
                    },
                    {
                        name: "instruction",
                        type: "felt252",
                        key: false,
                    },
                ],
                class_hash: "0x440789355e8629124eadd90c87565fa9b292867dda0bd2af82775daff0410b0",
                original_class_hash: "0x440789355e8629124eadd90c87565fa9b292867dda0bd2af82775daff0410b0",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "instructionImpl",
                        interface_name: "pixelaw::core::models::registry::Iinstruction",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::registry::Instruction",
                        members: [
                            {
                                name: "system",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "instruction",
                                type: "core::felt252",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::registry::Iinstruction",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::registry::Instruction",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::registry::instruction::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-Instruction",
                manifest_name: "pixelaw-Instruction-4c7c4844",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "allowing_app",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "allowed_app",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "permission",
                        type: "Permission",
                        key: false,
                    },
                ],
                class_hash: "0x48ef94b040bd6c1a59ebe32889aaee72ef3bb2bb5ea117aac4fd70daf5fda87",
                original_class_hash: "0x48ef94b040bd6c1a59ebe32889aaee72ef3bb2bb5ea117aac4fd70daf5fda87",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "permissionsImpl",
                        interface_name: "pixelaw::core::models::permissions::Ipermissions",
                    },
                    {
                        type: "enum",
                        name: "core::bool",
                        variants: [
                            {
                                name: "False",
                                type: "()",
                            },
                            {
                                name: "True",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::permissions::Permission",
                        members: [
                            {
                                name: "app",
                                type: "core::bool",
                            },
                            {
                                name: "color",
                                type: "core::bool",
                            },
                            {
                                name: "owner",
                                type: "core::bool",
                            },
                            {
                                name: "text",
                                type: "core::bool",
                            },
                            {
                                name: "timestamp",
                                type: "core::bool",
                            },
                            {
                                name: "action",
                                type: "core::bool",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::permissions::Permissions",
                        members: [
                            {
                                name: "allowing_app",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "allowed_app",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "permission",
                                type: "pixelaw::core::models::permissions::Permission",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::permissions::Ipermissions",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::permissions::Permissions",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::permissions::permissions::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-Permissions",
                manifest_name: "pixelaw-Permissions-72b77307",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "x",
                        type: "u32",
                        key: true,
                    },
                    {
                        name: "y",
                        type: "u32",
                        key: true,
                    },
                    {
                        name: "app",
                        type: "ContractAddress",
                        key: false,
                    },
                    {
                        name: "color",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "created_at",
                        type: "u64",
                        key: false,
                    },
                    {
                        name: "updated_at",
                        type: "u64",
                        key: false,
                    },
                    {
                        name: "timestamp",
                        type: "u64",
                        key: false,
                    },
                    {
                        name: "owner",
                        type: "ContractAddress",
                        key: false,
                    },
                    {
                        name: "text",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "action",
                        type: "felt252",
                        key: false,
                    },
                ],
                class_hash: "0x288005baf6abddd2137448ac4f50313a080272ca07206d871714acb19f8d1a1",
                original_class_hash: "0x288005baf6abddd2137448ac4f50313a080272ca07206d871714acb19f8d1a1",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "pixelImpl",
                        interface_name: "pixelaw::core::models::pixel::Ipixel",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::pixel::Pixel",
                        members: [
                            {
                                name: "x",
                                type: "core::integer::u32",
                            },
                            {
                                name: "y",
                                type: "core::integer::u32",
                            },
                            {
                                name: "app",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "color",
                                type: "core::integer::u32",
                            },
                            {
                                name: "created_at",
                                type: "core::integer::u64",
                            },
                            {
                                name: "updated_at",
                                type: "core::integer::u64",
                            },
                            {
                                name: "timestamp",
                                type: "core::integer::u64",
                            },
                            {
                                name: "owner",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "text",
                                type: "core::felt252",
                            },
                            {
                                name: "action",
                                type: "core::felt252",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::pixel::Ipixel",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::pixel::Pixel",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::pixel::pixel::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-Pixel",
                manifest_name: "pixelaw-Pixel-7e607b2f",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "id",
                        type: "felt252",
                        key: true,
                    },
                    {
                        name: "valid",
                        type: "bool",
                        key: false,
                    },
                ],
                class_hash: "0xc917ec6d3d779b12ce30a91a54553769df087185e7931df9b6d82bf803fd82",
                original_class_hash: "0xc917ec6d3d779b12ce30a91a54553769df087185e7931df9b6d82bf803fd82",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "queue_itemImpl",
                        interface_name: "pixelaw::core::models::queue::Iqueue_item",
                    },
                    {
                        type: "enum",
                        name: "core::bool",
                        variants: [
                            {
                                name: "False",
                                type: "()",
                            },
                            {
                                name: "True",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "pixelaw::core::models::queue::QueueItem",
                        members: [
                            {
                                name: "id",
                                type: "core::felt252",
                            },
                            {
                                name: "valid",
                                type: "core::bool",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::core::models::queue::Iqueue_item",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::core::models::queue::QueueItem",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::core::models::queue::queue_item::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-QueueItem",
                manifest_name: "pixelaw-QueueItem-549a17f2",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "owner",
                        type: "ContractAddress",
                        key: true,
                    },
                    {
                        name: "length",
                        type: "u8",
                        key: false,
                    },
                    {
                        name: "first_segment_id",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "last_segment_id",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "direction",
                        type: "Direction",
                        key: false,
                    },
                    {
                        name: "color",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "text",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "is_dying",
                        type: "bool",
                        key: false,
                    },
                ],
                class_hash: "0x1f0095e3609d2a2c6de25ab2265b8e069e7933d00efd574a49ac88e8824d1e6",
                original_class_hash: "0x1f0095e3609d2a2c6de25ab2265b8e069e7933d00efd574a49ac88e8824d1e6",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "snakeImpl",
                        interface_name: "pixelaw::apps::snake::app::Isnake",
                    },
                    {
                        type: "enum",
                        name: "pixelaw::core::utils::Direction",
                        variants: [
                            {
                                name: "None",
                                type: "()",
                            },
                            {
                                name: "Left",
                                type: "()",
                            },
                            {
                                name: "Right",
                                type: "()",
                            },
                            {
                                name: "Up",
                                type: "()",
                            },
                            {
                                name: "Down",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::bool",
                        variants: [
                            {
                                name: "False",
                                type: "()",
                            },
                            {
                                name: "True",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "pixelaw::apps::snake::app::Snake",
                        members: [
                            {
                                name: "owner",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                            {
                                name: "length",
                                type: "core::integer::u8",
                            },
                            {
                                name: "first_segment_id",
                                type: "core::integer::u32",
                            },
                            {
                                name: "last_segment_id",
                                type: "core::integer::u32",
                            },
                            {
                                name: "direction",
                                type: "pixelaw::core::utils::Direction",
                            },
                            {
                                name: "color",
                                type: "core::integer::u32",
                            },
                            {
                                name: "text",
                                type: "core::felt252",
                            },
                            {
                                name: "is_dying",
                                type: "core::bool",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::apps::snake::app::Isnake",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::apps::snake::app::Snake",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::apps::snake::app::snake::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-Snake",
                manifest_name: "pixelaw-Snake-62b876d4",
            },
            {
                kind: "DojoModel",
                members: [
                    {
                        name: "id",
                        type: "u32",
                        key: true,
                    },
                    {
                        name: "previous_id",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "next_id",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "x",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "y",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "pixel_original_color",
                        type: "u32",
                        key: false,
                    },
                    {
                        name: "pixel_original_text",
                        type: "felt252",
                        key: false,
                    },
                    {
                        name: "pixel_original_app",
                        type: "ContractAddress",
                        key: false,
                    },
                ],
                class_hash: "0x2ab181817af202387b9252ecf533895ef5f681fd08db394e36efcecb074c532",
                original_class_hash: "0x2ab181817af202387b9252ecf533895ef5f681fd08db394e36efcecb074c532",
                abi: [
                    {
                        type: "impl",
                        name: "DojoModelImpl",
                        interface_name: "dojo::model::IModel",
                    },
                    {
                        type: "struct",
                        name: "core::byte_array::ByteArray",
                        members: [
                            {
                                name: "data",
                                type: "core::array::Array::<core::bytes_31::bytes31>",
                            },
                            {
                                name: "pending_word",
                                type: "core::felt252",
                            },
                            {
                                name: "pending_word_len",
                                type: "core::integer::u32",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "core::option::Option::<core::integer::u32>",
                        variants: [
                            {
                                name: "Some",
                                type: "core::integer::u32",
                            },
                            {
                                name: "None",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::integer::u8>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::integer::u8>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::FieldLayout",
                        members: [
                            {
                                name: "selector",
                                type: "core::felt252",
                            },
                            {
                                name: "layout",
                                type: "dojo::database::introspect::Layout",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Layout>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Layout>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Layout",
                        variants: [
                            {
                                name: "Fixed",
                                type: "core::array::Span::<core::integer::u8>",
                            },
                            {
                                name: "Struct",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Layout>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                            {
                                name: "Enum",
                                type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<core::felt252>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<core::felt252>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Member",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "ty",
                                type: "dojo::database::introspect::Ty",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Member>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Struct",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<dojo::database::introspect::Member>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "dojo::database::introspect::Enum",
                        members: [
                            {
                                name: "name",
                                type: "core::felt252",
                            },
                            {
                                name: "attrs",
                                type: "core::array::Span::<core::felt252>",
                            },
                            {
                                name: "children",
                                type: "core::array::Span::<(core::felt252, dojo::database::introspect::Ty)>",
                            },
                        ],
                    },
                    {
                        type: "struct",
                        name: "core::array::Span::<dojo::database::introspect::Ty>",
                        members: [
                            {
                                name: "snapshot",
                                type: "@core::array::Array::<dojo::database::introspect::Ty>",
                            },
                        ],
                    },
                    {
                        type: "enum",
                        name: "dojo::database::introspect::Ty",
                        variants: [
                            {
                                name: "Primitive",
                                type: "core::felt252",
                            },
                            {
                                name: "Struct",
                                type: "dojo::database::introspect::Struct",
                            },
                            {
                                name: "Enum",
                                type: "dojo::database::introspect::Enum",
                            },
                            {
                                name: "Tuple",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "Array",
                                type: "core::array::Span::<dojo::database::introspect::Ty>",
                            },
                            {
                                name: "ByteArray",
                                type: "()",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "dojo::model::IModel",
                        items: [
                            {
                                type: "function",
                                name: "name",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "tag",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::byte_array::ByteArray",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "version",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::integer::u8",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "selector",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "name_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "namespace_hash",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::felt252",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "unpacked_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "packed_size",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "core::option::Option::<core::integer::u32>",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "layout",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Layout",
                                    },
                                ],
                                state_mutability: "view",
                            },
                            {
                                type: "function",
                                name: "schema",
                                inputs: [],
                                outputs: [
                                    {
                                        type: "dojo::database::introspect::Ty",
                                    },
                                ],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "impl",
                        name: "snake_segmentImpl",
                        interface_name: "pixelaw::apps::snake::app::Isnake_segment",
                    },
                    {
                        type: "struct",
                        name: "pixelaw::apps::snake::app::SnakeSegment",
                        members: [
                            {
                                name: "id",
                                type: "core::integer::u32",
                            },
                            {
                                name: "previous_id",
                                type: "core::integer::u32",
                            },
                            {
                                name: "next_id",
                                type: "core::integer::u32",
                            },
                            {
                                name: "x",
                                type: "core::integer::u32",
                            },
                            {
                                name: "y",
                                type: "core::integer::u32",
                            },
                            {
                                name: "pixel_original_color",
                                type: "core::integer::u32",
                            },
                            {
                                name: "pixel_original_text",
                                type: "core::felt252",
                            },
                            {
                                name: "pixel_original_app",
                                type: "core::starknet::contract_address::ContractAddress",
                            },
                        ],
                    },
                    {
                        type: "interface",
                        name: "pixelaw::apps::snake::app::Isnake_segment",
                        items: [
                            {
                                type: "function",
                                name: "ensure_abi",
                                inputs: [
                                    {
                                        name: "model",
                                        type: "pixelaw::apps::snake::app::SnakeSegment",
                                    },
                                ],
                                outputs: [],
                                state_mutability: "view",
                            },
                        ],
                    },
                    {
                        type: "event",
                        name: "pixelaw::apps::snake::app::snake_segment::Event",
                        kind: "enum",
                        variants: [],
                    },
                ],
                tag: "pixelaw-SnakeSegment",
                manifest_name: "pixelaw-SnakeSegment-302de0d8",
            },
        ],
        world: {
            kind: "WorldContract",
            class_hash: "0x564a2ff36752ddda913033318645e313928c7c96dc02efc82f597a66a9c6e58",
            original_class_hash: "0x564a2ff36752ddda913033318645e313928c7c96dc02efc82f597a66a9c6e58",
            abi: [
                {
                    type: "impl",
                    name: "World",
                    interface_name: "dojo::world::IWorld",
                },
                {
                    type: "struct",
                    name: "core::byte_array::ByteArray",
                    members: [
                        {
                            name: "data",
                            type: "core::array::Array::<core::bytes_31::bytes31>",
                        },
                        {
                            name: "pending_word",
                            type: "core::felt252",
                        },
                        {
                            name: "pending_word_len",
                            type: "core::integer::u32",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::resource_metadata::ResourceMetadata",
                    members: [
                        {
                            name: "resource_id",
                            type: "core::felt252",
                        },
                        {
                            name: "metadata_uri",
                            type: "core::byte_array::ByteArray",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::felt252>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::felt252>",
                        },
                    ],
                },
                {
                    type: "enum",
                    name: "dojo::world::ModelIndex",
                    variants: [
                        {
                            name: "Keys",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "Id",
                            type: "core::felt252",
                        },
                        {
                            name: "MemberId",
                            type: "(core::felt252, core::felt252)",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<core::integer::u8>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<core::integer::u8>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::database::introspect::FieldLayout",
                    members: [
                        {
                            name: "selector",
                            type: "core::felt252",
                        },
                        {
                            name: "layout",
                            type: "dojo::database::introspect::Layout",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<dojo::database::introspect::FieldLayout>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<dojo::database::introspect::Layout>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<dojo::database::introspect::Layout>",
                        },
                    ],
                },
                {
                    type: "enum",
                    name: "dojo::database::introspect::Layout",
                    variants: [
                        {
                            name: "Fixed",
                            type: "core::array::Span::<core::integer::u8>",
                        },
                        {
                            name: "Struct",
                            type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        },
                        {
                            name: "Tuple",
                            type: "core::array::Span::<dojo::database::introspect::Layout>",
                        },
                        {
                            name: "Array",
                            type: "core::array::Span::<dojo::database::introspect::Layout>",
                        },
                        {
                            name: "ByteArray",
                            type: "()",
                        },
                        {
                            name: "Enum",
                            type: "core::array::Span::<dojo::database::introspect::FieldLayout>",
                        },
                    ],
                },
                {
                    type: "enum",
                    name: "core::bool",
                    variants: [
                        {
                            name: "False",
                            type: "()",
                        },
                        {
                            name: "True",
                            type: "()",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo::world::IWorld",
                    items: [
                        {
                            type: "function",
                            name: "metadata",
                            inputs: [
                                {
                                    name: "resource_id",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [
                                {
                                    type: "dojo::resource_metadata::ResourceMetadata",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "set_metadata",
                            inputs: [
                                {
                                    name: "metadata",
                                    type: "dojo::resource_metadata::ResourceMetadata",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "model",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [
                                {
                                    type: "(core::starknet::class_hash::ClassHash, core::starknet::contract_address::ContractAddress)",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "contract",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [
                                {
                                    type: "(core::starknet::class_hash::ClassHash, core::starknet::contract_address::ContractAddress)",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "register_model",
                            inputs: [
                                {
                                    name: "class_hash",
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "register_namespace",
                            inputs: [
                                {
                                    name: "namespace",
                                    type: "core::byte_array::ByteArray",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "deploy_contract",
                            inputs: [
                                {
                                    name: "salt",
                                    type: "core::felt252",
                                },
                                {
                                    name: "class_hash",
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                                {
                                    name: "init_calldata",
                                    type: "core::array::Span::<core::felt252>",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "upgrade_contract",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "class_hash",
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "uuid",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::integer::u32",
                                },
                            ],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "emit",
                            inputs: [
                                {
                                    name: "keys",
                                    type: "core::array::Array::<core::felt252>",
                                },
                                {
                                    name: "values",
                                    type: "core::array::Span::<core::felt252>",
                                },
                            ],
                            outputs: [],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "entity",
                            inputs: [
                                {
                                    name: "model_selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "index",
                                    type: "dojo::world::ModelIndex",
                                },
                                {
                                    name: "layout",
                                    type: "dojo::database::introspect::Layout",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::array::Span::<core::felt252>",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "set_entity",
                            inputs: [
                                {
                                    name: "model_selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "index",
                                    type: "dojo::world::ModelIndex",
                                },
                                {
                                    name: "values",
                                    type: "core::array::Span::<core::felt252>",
                                },
                                {
                                    name: "layout",
                                    type: "dojo::database::introspect::Layout",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "delete_entity",
                            inputs: [
                                {
                                    name: "model_selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "index",
                                    type: "dojo::world::ModelIndex",
                                },
                                {
                                    name: "layout",
                                    type: "dojo::database::introspect::Layout",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "base",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "is_owner",
                            inputs: [
                                {
                                    name: "address",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "grant_owner",
                            inputs: [
                                {
                                    name: "address",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "revoke_owner",
                            inputs: [
                                {
                                    name: "address",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "is_writer",
                            inputs: [
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "grant_writer",
                            inputs: [
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "revoke_writer",
                            inputs: [
                                {
                                    name: "resource",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "can_write_resource",
                            inputs: [
                                {
                                    name: "resource_id",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "can_write_model",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "can_write_contract",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "can_write_namespace",
                            inputs: [
                                {
                                    name: "selector",
                                    type: "core::felt252",
                                },
                                {
                                    name: "contract",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [
                                {
                                    type: "core::bool",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "UpgradeableWorld",
                    interface_name: "dojo::world::IUpgradeableWorld",
                },
                {
                    type: "interface",
                    name: "dojo::world::IUpgradeableWorld",
                    items: [
                        {
                            type: "function",
                            name: "upgrade",
                            inputs: [
                                {
                                    name: "new_class_hash",
                                    type: "core::starknet::class_hash::ClassHash",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "UpgradeableState",
                    interface_name: "dojo::interfaces::IUpgradeableState",
                },
                {
                    type: "struct",
                    name: "dojo::interfaces::StorageUpdate",
                    members: [
                        {
                            name: "key",
                            type: "core::felt252",
                        },
                        {
                            name: "value",
                            type: "core::felt252",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "core::array::Span::<dojo::interfaces::StorageUpdate>",
                    members: [
                        {
                            name: "snapshot",
                            type: "@core::array::Array::<dojo::interfaces::StorageUpdate>",
                        },
                    ],
                },
                {
                    type: "struct",
                    name: "dojo::interfaces::ProgramOutput",
                    members: [
                        {
                            name: "prev_state_root",
                            type: "core::felt252",
                        },
                        {
                            name: "new_state_root",
                            type: "core::felt252",
                        },
                        {
                            name: "block_number",
                            type: "core::felt252",
                        },
                        {
                            name: "block_hash",
                            type: "core::felt252",
                        },
                        {
                            name: "config_hash",
                            type: "core::felt252",
                        },
                        {
                            name: "world_da_hash",
                            type: "core::felt252",
                        },
                        {
                            name: "message_to_starknet_segment",
                            type: "core::array::Span::<core::felt252>",
                        },
                        {
                            name: "message_to_appchain_segment",
                            type: "core::array::Span::<core::felt252>",
                        },
                    ],
                },
                {
                    type: "interface",
                    name: "dojo::interfaces::IUpgradeableState",
                    items: [
                        {
                            type: "function",
                            name: "upgrade_state",
                            inputs: [
                                {
                                    name: "new_state",
                                    type: "core::array::Span::<dojo::interfaces::StorageUpdate>",
                                },
                                {
                                    name: "program_output",
                                    type: "dojo::interfaces::ProgramOutput",
                                },
                                {
                                    name: "program_hash",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                    ],
                },
                {
                    type: "impl",
                    name: "ConfigImpl",
                    interface_name: "dojo::config::interface::IConfig",
                },
                {
                    type: "interface",
                    name: "dojo::config::interface::IConfig",
                    items: [
                        {
                            type: "function",
                            name: "set_differ_program_hash",
                            inputs: [
                                {
                                    name: "program_hash",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "set_merger_program_hash",
                            inputs: [
                                {
                                    name: "program_hash",
                                    type: "core::felt252",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "get_differ_program_hash",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::felt252",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "get_merger_program_hash",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::felt252",
                                },
                            ],
                            state_mutability: "view",
                        },
                        {
                            type: "function",
                            name: "set_facts_registry",
                            inputs: [
                                {
                                    name: "address",
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            outputs: [],
                            state_mutability: "external",
                        },
                        {
                            type: "function",
                            name: "get_facts_registry",
                            inputs: [],
                            outputs: [
                                {
                                    type: "core::starknet::contract_address::ContractAddress",
                                },
                            ],
                            state_mutability: "view",
                        },
                    ],
                },
                {
                    type: "constructor",
                    name: "constructor",
                    inputs: [
                        {
                            name: "contract_base",
                            type: "core::starknet::class_hash::ClassHash",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::WorldSpawned",
                    kind: "struct",
                    members: [
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "creator",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::ContractDeployed",
                    kind: "struct",
                    members: [
                        {
                            name: "salt",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                        {
                            name: "name",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::ContractUpgraded",
                    kind: "struct",
                    members: [
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::WorldUpgraded",
                    kind: "struct",
                    members: [
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::MetadataUpdate",
                    kind: "struct",
                    members: [
                        {
                            name: "resource",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "uri",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::NamespaceRegistered",
                    kind: "struct",
                    members: [
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                        {
                            name: "hash",
                            type: "core::felt252",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::ModelRegistered",
                    kind: "struct",
                    members: [
                        {
                            name: "name",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                        {
                            name: "namespace",
                            type: "core::byte_array::ByteArray",
                            kind: "data",
                        },
                        {
                            name: "class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                        {
                            name: "prev_class_hash",
                            type: "core::starknet::class_hash::ClassHash",
                            kind: "data",
                        },
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "prev_address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::StoreSetRecord",
                    kind: "struct",
                    members: [
                        {
                            name: "table",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "keys",
                            type: "core::array::Span::<core::felt252>",
                            kind: "data",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::StoreUpdateRecord",
                    kind: "struct",
                    members: [
                        {
                            name: "table",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "entity_id",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "values",
                            type: "core::array::Span::<core::felt252>",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::StoreDelRecord",
                    kind: "struct",
                    members: [
                        {
                            name: "table",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "entity_id",
                            type: "core::felt252",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::WriterUpdated",
                    kind: "struct",
                    members: [
                        {
                            name: "resource",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "contract",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "value",
                            type: "core::bool",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::OwnerUpdated",
                    kind: "struct",
                    members: [
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                        {
                            name: "resource",
                            type: "core::felt252",
                            kind: "data",
                        },
                        {
                            name: "value",
                            type: "core::bool",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::config::component::Config::DifferProgramHashUpdate",
                    kind: "struct",
                    members: [
                        {
                            name: "program_hash",
                            type: "core::felt252",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::config::component::Config::MergerProgramHashUpdate",
                    kind: "struct",
                    members: [
                        {
                            name: "program_hash",
                            type: "core::felt252",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::config::component::Config::FactsRegistryUpdate",
                    kind: "struct",
                    members: [
                        {
                            name: "address",
                            type: "core::starknet::contract_address::ContractAddress",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::config::component::Config::Event",
                    kind: "enum",
                    variants: [
                        {
                            name: "DifferProgramHashUpdate",
                            type: "dojo::config::component::Config::DifferProgramHashUpdate",
                            kind: "nested",
                        },
                        {
                            name: "MergerProgramHashUpdate",
                            type: "dojo::config::component::Config::MergerProgramHashUpdate",
                            kind: "nested",
                        },
                        {
                            name: "FactsRegistryUpdate",
                            type: "dojo::config::component::Config::FactsRegistryUpdate",
                            kind: "nested",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::StateUpdated",
                    kind: "struct",
                    members: [
                        {
                            name: "da_hash",
                            type: "core::felt252",
                            kind: "data",
                        },
                    ],
                },
                {
                    type: "event",
                    name: "dojo::world::world::Event",
                    kind: "enum",
                    variants: [
                        {
                            name: "WorldSpawned",
                            type: "dojo::world::world::WorldSpawned",
                            kind: "nested",
                        },
                        {
                            name: "ContractDeployed",
                            type: "dojo::world::world::ContractDeployed",
                            kind: "nested",
                        },
                        {
                            name: "ContractUpgraded",
                            type: "dojo::world::world::ContractUpgraded",
                            kind: "nested",
                        },
                        {
                            name: "WorldUpgraded",
                            type: "dojo::world::world::WorldUpgraded",
                            kind: "nested",
                        },
                        {
                            name: "MetadataUpdate",
                            type: "dojo::world::world::MetadataUpdate",
                            kind: "nested",
                        },
                        {
                            name: "NamespaceRegistered",
                            type: "dojo::world::world::NamespaceRegistered",
                            kind: "nested",
                        },
                        {
                            name: "ModelRegistered",
                            type: "dojo::world::world::ModelRegistered",
                            kind: "nested",
                        },
                        {
                            name: "StoreSetRecord",
                            type: "dojo::world::world::StoreSetRecord",
                            kind: "nested",
                        },
                        {
                            name: "StoreUpdateRecord",
                            type: "dojo::world::world::StoreUpdateRecord",
                            kind: "nested",
                        },
                        {
                            name: "StoreDelRecord",
                            type: "dojo::world::world::StoreDelRecord",
                            kind: "nested",
                        },
                        {
                            name: "WriterUpdated",
                            type: "dojo::world::world::WriterUpdated",
                            kind: "nested",
                        },
                        {
                            name: "OwnerUpdated",
                            type: "dojo::world::world::OwnerUpdated",
                            kind: "nested",
                        },
                        {
                            name: "ConfigEvent",
                            type: "dojo::config::component::Config::Event",
                            kind: "nested",
                        },
                        {
                            name: "StateUpdated",
                            type: "dojo::world::world::StateUpdated",
                            kind: "nested",
                        },
                    ],
                },
            ],
            transaction_hash: null,
            block_number: null,
            seed: "pixelaw",
            metadata: {
                profile_name: "dev",
                rpc_url: "http://localhost:5050/",
            },
            manifest_name: "dojo-world",
            address: worldAddress,
        },
    }
}
