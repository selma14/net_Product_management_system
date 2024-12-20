
let currentProductPage = 1;
const productLimit = 4;
loadCategories();
loadProducts();
fetchTotalPages();
async function getTotalPages() {
    const url = 'http://localhost:8000/api/products';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const totalItems = data.total;
      const itemsPerPage = 3;
      const divisionResult = totalItems / itemsPerPage;
      const totalPages = Number.isInteger(divisionResult) ? divisionResult : Math.floor(divisionResult) + 1;

      return totalPages;
    } catch (error) {
      console.error('Error fetching data:', error);
      return 0;
    }
  }

  let totalPages;

  async function fetchTotalPages() {
    totalPages = await getTotalPages();
    console.log(`Total pages: ${totalPages}`);
  }






function nextPage(type) {
    if (type === 'products' && currentProductPage < totalPages) {
        loadProducts(currentProductPage + 1);
    } else if (type === 'categories') {
        loadCategories(currentCategoryPage + 1);
    }
}

function prevPage(type) {
    if (type === 'products' && currentProductPage > 1) {
        loadProducts(currentProductPage - 1);
    } else if (type === 'categories') {
        loadCategories(currentCategoryPage - 1);
    }
}


    //loading products and categories at refresh


    //initializing state of currently edited product or category to null
    let currentEditingProductId = null;
    let currentEditingCategoryId = null;

    //function to manage state of products and categories loading
    function showLoadingIndicator() {
        document.getElementById('loading-indicator').style.display = 'block';
    }

    function hideLoadingIndicator() {
        document.getElementById('loading-indicator').style.display = 'none';
    }


    //PRODUCTS
    //Function to load products (READ ALL PRODUCTS)
    function loadProducts(page = 1) {
        showLoadingIndicator();
        axios.get(`http://localhost:8000/api/products?page=${page}&limit=${productLimit}`)
            .then(response => {
                const products = response.data.data || []; // Products array
                const meta = response.data.meta || {}; // Pagination metadata
                const { current_page } = meta;

                // Update current page and total pages
                currentProductPage = page; // Ensure currentPage is updated properly
                 // Ensure totalPages is valid

                let html = '';
                products.forEach(product => {
                    html += `
                        <div id="product-${product.id}">
                            <h4 id="product-name-${product.id}">${product.name}</h4>
                            <p id="product-description-${product.id}">${product.description}</p>
                            <p id="product-price-${product.id}">Price: $${product.price}</p>
                            <p id="product-category-${product.id}">Category: ${product.category.name}</p>
                            ${product.image ? `<img src="/storage/${product.image}" alt="${product.name}" width="100" height="100">` : ''}
                            <br>
                            <br>
                            <button onclick="deleteProduct(${product.id})" style="background-color: #FFA7A6;">Delete</button>
                            <br><br>
                            <button style="background-color: #FFB6C1;" onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, ${product.category.id}, '${product.image}')">Modify</button>
                        </div>
                    `;
                });

                document.getElementById('product-list').innerHTML = html;

                // Update pagination controls
                document.getElementById('product-page-info').textContent = `Page ${currentProductPage} of ${totalPages}`;
                document.getElementById('prev-products').disabled = currentProductPage === 1;
                document.getElementById('next-products').disabled = currentProductPage === totalPages;
            })
            .catch(error => console.error('Error loading products:', error))
            .finally(() => hideLoadingIndicator());
    }





    //Function to delete a product (DELETE A PRODUCT)
    function deleteProduct(productId) {
            axios.delete(`http://localhost:8000/api/products/${productId}`)
                .then(response => {
                    alert(response.data.message);
                    document.getElementById(`product-${productId}`).remove(); // Remove the product from the DOM
                })
                .catch(error => console.error('Error deleting product:', error));
    }

    //Function to create a product (triggered by form submission and usage of prevent default to avoid rechargement page) , (CREATE A PRODUCT)
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        loadCategories();
        let formData = new FormData();
        formData.append('name', document.getElementById('product-name').value);
        formData.append('description', document.getElementById('product-description').value);
        formData.append('price', document.getElementById('product-price').value);
        formData.append('category_id', document.getElementById('category-select').value);


        const productImage = document.getElementById('product-image').files[0];
        if (productImage) {
            formData.append('image', productImage);
        }


        axios.post('http://localhost:8000/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert(response.data.message);
            loadProducts();
            resetForm();
        })
        .catch(error => console.error('Error creating product:', error));

    });

    //Function to turn product info into editable fields for update
    function editProduct(id, name, description, price, categoryId, image) {
        currentEditingProductId = id;
        const productElement = document.getElementById(`product-${id}`);

        // Display the editable form
        productElement.innerHTML = `
            <div>
                <label for="edit-product-name-${id}">Product Name:</label>
                <input type="text" id="edit-product-name-${id}" value="${name}"><br>

                <label for="edit-product-description-${id}">Product Description:</label>
                <textarea id="edit-product-description-${id}">${description}</textarea><br>

                <label for="edit-product-price-${id}">Price:</label>
                <input type="number" id="edit-product-price-${id}" value="${price}"><br>

                <label for="edit-category-select-${id}">Category:</label>
                <select id="edit-category-select-${id}"></select><br>

                <label for="edit-product-image-${id}">Product Image:</label>
                <input type="file" id="edit-product-image-${id}" accept="image/*" ><br>

                ${image ? `<img src="/storage/${image}" alt="Current Image" id="current-product-image-${id}" width="100" height="100"><br>` : ''}

                <button onclick="updateProduct(${id})" style="background-color: #FFB6C1;">Validate Update</button>
                <button onclick="cancelEdit(${id})" style="background-color: #FFA7A6;">Cancel</button>
            </div>
        `;

        // Load categories into the edit form
        loadCategoriesForEdit(id);
    }

    //Function to update a product (UPDATE A PRODUCT)
    function updateProduct(id) {
        const updatedName = document.getElementById(`edit-product-name-${id}`).value;
        const updatedDescription = document.getElementById(`edit-product-description-${id}`).value;
        const updatedPrice = document.getElementById(`edit-product-price-${id}`).value;
        const updatedCategoryId = document.getElementById(`edit-category-select-${id}`).value;

        // First update text fields
        axios.put(`http://localhost:8000/api/products/${id}`, {
            name: updatedName,
            description: updatedDescription,
            price: updatedPrice,
            category_id: updatedCategoryId
        }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            const updatedImage = document.getElementById(`edit-product-image-${id}`).files[0];

            // Handle image upload if a new image is provided
            if (updatedImage) {
                const formData = new FormData();
                formData.append('image', updatedImage);

                axios.post(`http://localhost:8000/api/products/${id}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(() => {
                    alert('Product updated successfully!');
                    loadProducts(); // Reload products after modifying
                }).catch(err => console.error('Error uploading image:', err));
            } else {
                alert('Product updated successfully!');
                loadProducts();
            }
        }).catch(err => console.error('Error updating product fields:', err));
    }

    //Function to reset product's creation fields after form submission
    function resetForm() {
        currentEditingProductId = null;
        document.getElementById('product-form').reset();
        document.querySelector('button[type="submit"]').textContent = 'Create Product';
    }

    //Function to cancel editing a product
    function cancelEdit(id) {
        loadProducts();
    }


    //CATEGORIES
    //Function to load categories (READ ALL CATEGORIES)
    function loadCategories() {
            showLoadingIndicator();
            axios.get('http://localhost:8000/api/categories')
                .then(response => {
                    const categories = response.data;
                    const categorySelect = document.getElementById('category-select');
                    categorySelect.innerHTML = '';

                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });

                    // Load existing categories for the category list
                    let categoryHtml = '';
                    categories.forEach(category => {
                        categoryHtml += `
                            <div id="category-${category.id}">
                                <br>
                                <h4 id="category-name-${category.id}">${category.name}</h4>
                                <br>
                                <button onclick="editCategory(${category.id}, '${category.name}')" style="background-color: #FFB6C1;">Modify</button>
                                <button onclick="deleteCategory(${category.id})" style="background-color: #FFA7A6;">Delete</button>

                            </div>
                        `;
                    });
                    document.getElementById('category-list').innerHTML = categoryHtml;
                })
                .catch(error => console.error('Error loading categories:', error))
                .finally(() => {
            hideLoadingIndicator();  // Masquer le loading après la réponse
        });
    }

    //Function to fetch categories into the product being edited
    function loadCategoriesForEdit(id) {
        axios.get('http://localhost:8000/api/categories')
            .then(response => {
                const categories = response.data;
                const categorySelect = document.getElementById(`edit-category-select-${id}`);
                categorySelect.innerHTML = '';

                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    }

    //Function to turn category fields into input for editing
    function editCategory(id, name) {
        currentEditingCategoryId = id; // Store the ID of the category being edited
        const categoryElement = document.getElementById(`category-${id}`);

        // Display the editable category name
        categoryElement.innerHTML = `
            <input type="text" id="edit-category-name-${id}" value="${name}">

            <button onclick="validateCategoryUpdate(${id})" style="background-color: #FFB6C1;">Validate Update</button>
            <button onclick="cancelCategoryEdit(${id})" style="background-color: #FFA7A6;">Cancel</button>
        `;
    }

    //Function to update a category (UPDATE CATEGORY)
    function validateCategoryUpdate(id) {
        const updatedCategoryName = document.getElementById(`edit-category-name-${id}`).value;

        axios.put(`http://localhost:8000/api/categories/${id}`, {
            name: updatedCategoryName
        }).then(() => {
            alert('Category updated successfully!');
            loadCategories();
        }).catch(err => console.error('Error updating category:', err));
    }

    //Function to delete a category (DELETE CATEGORY)
    function deleteCategory(categoryId) {
        axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
            .then(response => {
                alert(response.data.message);
                document.getElementById(`category-${categoryId}`).remove(); // Remove the category from the DOM
            })
            .catch(error => console.error('Error deleting category:', error));
    }

    //Function to cancel editing a category
    function cancelCategoryEdit(id) {
        loadCategories();
    }

    //Function to create a category (CREATE A CATEGORY)
    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from reloading the page

        const categoryName = document.getElementById('category-name').value;

        axios.post('http://localhost:8000/api/categories', { name: categoryName })
            .then(response => {
                alert(response.data.message);
                loadCategories();
                document.getElementById('category-form').reset();
            })
            .catch(error => console.error('Error creating category:', error));
    });
