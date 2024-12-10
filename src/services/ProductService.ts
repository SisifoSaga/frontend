import { safeParse, pipe, number, parse, string, transform } from "valibot";
import { DraftProductSchema, ProductsSchema, Product, ProductSchema } from "../types";
import axios from "axios";
import { toBoolean } from "../utils";

type ProductData = {
    [k: string]: FormDataEntryValue;
};

export async function addProduct(data: ProductData) {
    try {
        const result = safeParse(DraftProductSchema, {
            name: data.name,
            price: +data.price,
        });
        if (result.success) {
            const url = ${import.meta.env.VITE_API_URL}/api/products;
            await axios.post(url, {
                name: result.output.name,
                price: result.output.price,
            });
        } else {
            throw new Error("Datos no válidos");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getProducts() {
    try {
        const url = ${import.meta.env.VITE_API_URL}/api/products;
        const { data } = await axios(url);

        // Valida los datos con el esquema
        const result = safeParse(ProductsSchema, data.data);

        if (result.success) {
            return result.output; // Devuelve los productos si son válidos
        } else {
            console.error("Error al validar los datos:", result.issues); // Usar 'issues' para depuración
            return []; // Devuelve un array vacío si la validación falla
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}


export async function getProductById(id: Product["id"]) {
    try {
        const url = ${import.meta.env.VITE_API_URL}/api/products/${id};
        const { data } = await axios(url);
        const result = safeParse(ProductSchema, data.data);
        if (result.success) {
            return result.output;
        } else {
            throw new Error("Hubo un error...");
        }
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
    }
}

export async function updateProduct(data: ProductData, id: Product["id"]) {
    try {
        const NumberSchema = pipe(string(), transform(Number), number());
        const result = safeParse(ProductSchema, {
            id,
            name: data.name,
            price: parse(NumberSchema, data.price),
            availability: toBoolean(data.availability.toString()),
        });

        if (result.success) {
            const url = ${import.meta.env.VITE_API_URL}/api/products/${id};
            await axios.put(url, result.output);
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    }
}

export async function deleteProduct(id: Product["id"]) {
    try {
        const url = ${import.meta.env.VITE_API_URL}/api/products/${id};
        await axios.delete(url);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}

export async function updateProductAvailability(id: Product["id"]) {
    try {
        const url = ${import.meta.env.VITE_API_URL}/api/products/${id};
        await axios.patch(url);
    } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
    }
}


export async function searchProducts(query: string) {
    try {
        const url = ${import.meta.env.VITE_API_URL}/api/products?search=${query};
        const { data } = await axios.get(url);
        const result = safeParse(ProductsSchema, data.data);
        if (result.success) {
            return result.output;
        } else {
            throw new Error("Error en los datos de búsqueda.");
        }
    } catch (error) {
        console.error("Error al buscar productos:", error);
        return []; // Retornar un arreglo vacío en caso de error
    }
}
