# Web Studio SDK

This is the official JavaScript/TypeScript SDK for Agility CMS's Web Studio.

Don't have an Agility CMS instance? Sign up for [Free Trial](https://agilitycms.com/free) today!

## Features

- Enable your website/app to use the new Web Studio features.
- Add the ability to collaborate and comment directly on your website/app.
- Empower your editors to preview content changes in real-time.

## Getting Started

You'll need to have an Agility CMS instance to use this SDK. If you don't have one, you can sign up for a [Free Trial](https://agilitycms.com/free) today!

Once you have an Agility CMS Instance you will need to install the sdk from npm and add a script tag in your website.

```html
<script src="https://unpkg.com/@agility/web-studio-sdk@latest/dist/index.js"></script>
```

You can stop there if you'd like. But to get the most of the SDK, you'll need to decorate your components, fields, and pages with the data-agility-\* attributes. This will allow the SDK to interact with your website/app, and enable real-time editing. You'll also need to add your guid as a data-agility-guid attribute to the root element of your website/app.

```html
<!DOCTYPE html>
<html lang="en" data-agility-guid="YOUR_GUID">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div data-agility-page="YOUR_PAGE_ID">
      <header data-agility-component="YOUR_CONTENT_ID">
        <h1 data-agility-field="title">{{fields.title}}</h1>
        <p data-agility-field="content">{{field.content}}</p>
      </header>
    </div>
  </body>
</html>
```

## Decorating Your Code

The SDK uses the `data-agility-\*` attributes to interact with your website/app. Here are the attributes you can use:

- `data-agility-guid`: This is the guid of your website/app. You can find this in the settings of your website in Agility CMS. The SDK uses this to know which instance your website/app is associated with.
  - Example:
  ```html
  <html lang="en" data-agility-guid="YOUR_GUID"></html>
  ```
- `data-agility-previewbar`: This is a boolean attribute that tells the SDK this is the preview bar element, and allows us to hide it using tailwind class. The SDK uses this to know that element should be hidden.

  - Example:

  ```html
  <div
    className="bg-agility relative px-8 text-gray-200"
    data-agility-previewbar
  >
    // your preview bar content
  </div>
  ```

- `data-agility-page`: This is the id of the page in Agility CMS. The SDK uses this to know which page is being interacted with, so we can track navigations and other page-specific events in Web Studio.

  - Example:

  ```html
  <body>
    <main data-agility-page="YOUR_PAGE_ID"></main>
  </body>
  ```

- `data-agility-dynamic-content`: This is the content id of the dynamic content in Agility CMS. The SDK uses this to know which dynamic content is being interacted with, so we can track dynamic-content specific events in Web Studio, allowing us to keep navigation and other information in sync.
  - Example:
  ```html
  <div data-agility-dynamic-content="YOUR_DYNAMIC_CONTENT_ID"></div>
  ```
- `data-agility-component`: This is the id of the component in Agility CMS. The SDK uses this to know which component is being interacted with, so we can track component-specific events in Web Studio and enable real-time editing.
  - Example:
  ```html
  <header data-agility-component="YOUR_COMPONENT_ID"></header>
  ```
- `data-agility-field`: This is the name of the field in Agility CMS. The SDK uses this to know which field is being interacted with, so we can track field-specific events in Web Studio and enable real-time editing of their content.
  - Example:
  ```html
  <h1 data-agility-field="title">{{fields.title}}</h1>
  ```
- `data-agility-html`: This is a boolean attribute that tells the SDK to treat the element as an HTML field. The SDK uses this to know that the field is an HTML field, so we can enable rich-text editing in Web Studio.
  - Example:
  ```html
  <div data-agility-field="blog-content" data-agility-html>
    {{fields.blog-content}}
  </div>
  ```

## Installation

**npm**

```
npm install @agility/web-studio-sdk
```

**yarn**

```
yarn add @agility/web-studio-sdk
```

## Running This Project Locally

You will need to have an Agility CMS instance and a website that you can also run locally. In the root of your site, add the following script tag

```html
<script src="http://127.0.0.1:8080/index.js"></script>
```

1. Clone this repository

2. Run `npm install`

3. Run `npm run dev`

4. On the Sitemaps page in Agility CMS, add a preview deployment that points at where your website is running locally, usually `http://localhost:3000`.

5. Go to the Pages module in Agility CMS and click on the "Preview" button to see Web Studio in action.

Also here is a handy Regex that's useful for debugging frame events in the chrome dev tools console:

```regex
/^Web Studio (SDK|CMS)/
```

## Resources

For docs & help around Agility CMS, please see [Agility CMS Documentation](https://help.agilitycms.com/hc/en-us)

## Tutorials

## Contributing

If you would like to contribute to this SDK, you can fork the repository and submit a pull request. We'd love to include your updates.
