const express = require("express")
const Producto = require("../models/productosModles.js");

const router = express.Router();

// crud basico de la api
// get de todos los productos

router.get("/productos", async (req, res) => {
    try {
      const productos = await Producto.find();
      res.status(200).send(productos);
    } catch (error) {
      res.status(500).send({ mensaje: "Error al obtener los productos", error });
    }
  });

// post para crear el producto

router.post("/productos", async (req, res) => {
    try {
      const nuevoProducto = new Producto(req.body);
      const productoGuardado = await nuevoProducto.save();
      res.status(201).send(productoGuardado);
    } catch (error) {
      res.status(400).send({ mensaje: "Error al crear el producto", error });
    }
  });

  // put para modificar un producto por id

  router.put("/productos/:id", async (req, res) => {
    try {
      const productoUpdate = await Producto.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!productoUpdate) {
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      }
      res.status(200).send(productoUpdate);
    } catch (error) {
      res.status(400).send({ mensaje: "Error al actualizar el producto", error });
    }
  });

  // eliminar producto por un id

  router.delete("/productos/:id", async (req, res) => {
    try {
      const productoDeleat = await Producto.findByIdAndDelete(req.params.id);
      if (!productoDeleat) {
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      }
      res
        .status(200)
        .send({ mensaje: "Producto eliminado", producto: productoDeleat });
    } catch (error) {
      res.status(500).send({ mensaje: "Error al eliminar el producto", error });
    }
  });
// endpoint de negocio

// endpoint 1: actualizar la cantidad de varios producto al mismo tiempo

router.put('/actualizar-stock', async (req, res) => {
    const { productos } = req.body;
  
    if (!Array.isArray(productos) || !productos.length) {
      return res.status(400).json({ error: 'Debe enviar un array de productos.' });
    }
  
    try {
    
      const operaciones = productos.map(({ id, cantidad }) => ({
        updateOne: { filter: { _id: id }, update: { cantidad } },
      }));
  
      const { modifiedCount } = await Producto.bulkWrite(operaciones);
  
      res.status(200).json({ message: `Stock actualizado para ${modifiedCount} productos.` });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar productos', detalle: error.message });
    }
  });

  // endpoint de negocio 2

// Obtener productos por categoría
router.get("/productos/categoria/:categoria", async (req, res) => {
    const categoria = req.params.categoria;
  
    try {
      const productos = await Producto.find({ categoria });
  
      if (productos.length === 0) {
        return res.status(404).send({
          mensaje: `No se encontraron productos en la categoría: ${categoria}`,
        });
      }
  
      res.status(200).send(productos);
    } catch (error) {
      res.status(500).send({
        mensaje: "Error al obtener los productos por categoría",
        error,
      });
    }
  });

  // Obtener productos con bajo stock
router.get("/productos/bajo-stock/:cantidad", async (req, res) => {
    const cantidadMinima = parseInt(req.params.cantidad);
  
    try {
      const productos = await Producto.find({
        cantidad: { $lt: cantidadMinima },
      });
      if (productos.length === 0) {
        return res.status(404).send({
          mensaje: `No se encontraron productos con stock menor a: ${cantidadMinima}`,
        });
      }
      res.status(200).send(productos);
    } catch (error) {
      res.status(500).send({
        mensaje: "Error al obtener los productos con bajo stock",
        error,
      });
    }
  });

  
module.exports = router;
