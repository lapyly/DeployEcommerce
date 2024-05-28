TO MAKE A PURCHASE:

STEP 1 - REGISTER 
    localhost:8080/api/auth/register
STEP 2 - LOGIN 
    localhost:8080/api/auth/login
STEP 3 - GET PRODUCTS 
    localhost:8080/api/stock/products
STEP 4 - ADD PRODUCTS TO YOUR CART 
    localhost:8080/api/cart/:cartId/product
STEP 5 - GET EMAIL WITH YOUR PURCHASE
    localhost:8080/api/cart/buy

AS USER YOU CAN:
    * Register: localhost:8080/api/auth/register
    * Login: localhost:8080/api/auth/login
    * Reset password: localhost:8080/api/auth/forgot-passwprd
    * Set new password: localhost:8080/api/auth/new-password/:token
    * See all products: localhost:8080/api/stock/products

AS SALES YOU CAN:
    * Register: localhost:8080/api/auth/register
    * Login: localhost:8080/api/auth/login
    * Reset password: localhost:8080/api/auth/forgot-passwprd
    * Set new password: localhost:8080/api/auth/new-password/:token
    * See all products: localhost:8080/api/stock/products
    * Create products: localhost:8080/api/stock/new-products
    * Update a products: localhost:8080/api/stock/update-products/:pid
    * Delete a product: localhost:8080/api/stock/delete-product/:pid

AS ADMIN YOU CAN:
    * Register: localhost:8080/api/auth/register
    * Login: localhost:8080/api/auth/login
    * See all users: localhost:8080/api/auth/users
    * Reset password: localhost:8080/api/auth/forgot-passwprd
    * Set new password: localhost:8080/api/auth/new-password/:token
    * Change authorization: localhost:8080/api/auth/change-authorizarion/:uid
    * Delete a user: localhost:8080/api/auth/delete/:uid
    * Delete old users: localhost:8080/api/auth/old-user
    * Mock users: localhost:8080/api/auth/mock:mid
    * See all products: localhost:8080/api/stock/products
    * Mock products: localhost:8080/api/stock/mock/:mid

    The endpoints were tested on Postman, check it out:
    https://www.postman.com/payload-geoscientist-16374152/workspace/final-project
    Don't forget to use token whenever is necessary.