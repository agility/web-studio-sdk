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
<script src=""></script>
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

### Installation

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

5. Go to the Pages module in Agility CMS and click on the "Preview" button to see the Web Studio in action.

Also here is a handy Regex that's useful for debugging frame events in the chrome dev tools console:

```regex
/^Web Studio (SDK|CMS)/
```

## Resources

For docs & help around Agility CMS, please see [Agility CMS Documentation](https://help.agilitycms.com/hc/en-us)

## Tutorials

## Contributing

If you would like to contribute to this SDK, you can fork the repository and submit a pull request. We'd love to include your updates.
