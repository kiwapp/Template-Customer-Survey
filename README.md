Template_Customer_Survey
========================

This app provides a simple form asking for a few personnal appreciations of services. Every text could be customized.

## File organisation
- `app/` : Folder who contains all application ready to use sources. 
    - `./index.html` : The index file, it loads the application and dependencies
    - `./manifest.json` : Kiwapp application manifest
    - `./styles/` :
        - `main.css` : Your css
        - `normalize.css` : Normalize dependency
    - `./scripts/` :
        - `app.js` : Our javascript file who contain all mechanics 
        - `vendor.min.js` : Your JavaScript dependencies
    - `./assets/` : Folder of assets as fonts...
        - `fonts/` : Appliction fonts
- `images/` : Folder who contains all images resources. 
- `sources/` : Folder who contains all application sources (for modifications look at [sources folder](sources/README.md) . 

## Dependencies

This application is build on top of :

- Backbone 1.1.0
- Lodash 2.4.1
- jQuery 2.0.3
- MomentJs 2.5.1
- Normalize CSS 2.1.3
- Kiwapp Library 1.2.4


## About the application

This application is built on top of **Backbone , Lodash and Kiwapp**, so it's working throught Ajax.

You will find inside this repository :
- app/ : folder containing app sources
- images/ : folder containing images resources
- app.zip : zip file of content App folder, add this zip to your manager.
- images.zip : zip file of content image folder , like upstaire. 
 
## Customize images

You just have to replace each images of your choice inside `/images/`.

If yours do not have the same name as ours, do not forget to update the `main.css` contains inside `app/style/main.css`.

## Customize text of application and Upload url

this template give you possibility to edit every questions and text and define upload url.

How to proceed:
- Go to `Kiwapp Manager` and log in.
- Select your `Customer` 
- Go to `shop` section and select your shop.
- Select application inside your `App set` and click on the config wheel
- Now you could write text for each pageg and `Parse` upload config or a specifique `Url` for collect form data.
