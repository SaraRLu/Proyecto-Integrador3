import productController from '../controllers/product.js';

console.warn('🆗: Módulo PageAlta cargado.');



setTimeout(()=>{
  function button(){
    const name= document.getElementById('nombre').value;
    const price= document.getElementById('precio').value;
    const stock= document.getElementById('stock').value;
    const brand= document.getElementById('marca').value;
    const category= document.getElementById('categoria').value;
    const form = document.getElementById('form')

if (name!=="" && price!=="" && stock!=="" && brand!=="" && category!=="" ){
    document.getElementById('btn').disabled = false
    }
    }

document.getElementById("nombre").addEventListener("change", button)
document.getElementById("precio").addEventListener("change", button)
document.getElementById('stock').addEventListener("change", button)
document.getElementById('marca').addEventListener('change', button)
document.getElementById('categoria').addEventListener('change', button)
  },100)


class PageAlta {

    static productsTableContainer;

    static async deleteProduct(e) {
        if (!confirm('¿Estás seguro de querer eliminar el producto?')) {
            return false;
        }
        const row = e.target.closest('tr');
        const _id = row.querySelector('td[data-product-property="_id"]').innerHTML;
        const deletedProduct = await productController.deleteProduct(_id);
        PageAlta.loadTable();
        return deletedProduct;
    }


   





        // console.log(product)
        // const CreatedProduct = await productController.saveProduct(product)
        // console.log(CreatedProduct);
        // PageCreate.loadTable();
        // PageCreate.form.reset();
        // return CreatedProduct;
    

    // static getProductFromRow(row) {
    //     const rowCells = row.children;
    //     const product = {};
    //     for (const cell of rowCells) {
    //         if (cell.dataset.productProperty) {
    //             product[cell.dataset.productProperty] = cell.innerHTML;
    //         }
    //     }
    //     return product;
    // }

    static async completeForm(e) {
        const row = e.target.closest('tr');
        const productToEdit = PageAlta.getProductFromRow(row);
        console.log('productToEdit:', productToEdit);
    }

    static async addTableEvents() {
        PageAlta.productsTableContainer.addEventListener('click', async e => {
            if (e.target.classList.contains('btn-delete')) {
                const deletedProduct = await PageAlta.deleteProduct(e);
                console.log('deletedProduct:', deletedProduct);
                return;
            }
            // if (e.target.classList.contains('btn-edit')) {
            //     PageAlta.completeForm(e);
            //     return;
            // }
        });
    }

    static async createProduct() {
        const formName = document.getElementById('nombre');
        const formPrice = document.getElementById('precio');
        const formStock = document.getElementById('stock');
        const formBrand = document.getElementById('marca');
        const formCategory = document.getElementById('categoria');
        const formShortDescription = document.getElementById('descripcion-larga');
    
        const productData = {
          name: formName.value,
          price: formPrice.value,
          stock: formStock.value,
          brand: formBrand.value,
          category: formCategory.value,
          descripcion_corta: formShortDescription.value,
        };
    
        try {
          const response = await productController.saveProduct(productData);
    
          if (response.ok) {
            alert('Producto agregado correctamente');
            form.reset();
            PageAlta.loadTable();
            return response;
          }
        } catch (error) {
          console.error(error);
          alert('Error al agregar el producto');
        }
      }
    


    static async renderTemplateTable(products) {
        const hbsFile = await fetch('templates/products-table.hbs').then(r => r.text());
        const template = Handlebars.compile(hbsFile);
        const html = template({ products });
        PageAlta.productsTableContainer.innerHTML = html;
    }

    static async loadTable() {
        const products = await productController.getProducts();
        console.log(`Se encontraron ${products.length} productos.`);
        PageAlta.renderTemplateTable(products);
    }

    static async prepareTable() {
        PageAlta.productsTableContainer = document.querySelector('.products-table');
        await PageAlta.loadTable();
        PageAlta.addTableEvents();
    }

    static async init () {
        console.log('PageAlta.init()');
        const form = document.getElementById('form');
        form.addEventListener('submit', async (e) => {
        await PageAlta.createProduct();
        });
        PageAlta.prepareTable();
    }

}

export default PageAlta;
