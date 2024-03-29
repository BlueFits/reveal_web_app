import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

  description = "Try blindfold dating! With Reveal, talk with someone wihout seeing what they look like at first, and then chose whether you both will reveal or not."

  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
            `,
            }}
          />
          <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
          <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <meta
            name="description"
            content={this.description}
            key="desc"
          />

          <meta property="og:description" content={this.description} key="ogdesc" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument