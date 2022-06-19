import Head from 'next/head'

const Meta = ({ title, keywords, description, icon }: { title: string, keywords: string, description: string, icon: string; }) => {
  return (
    <Head>
      <meta name="theme-color" content="#0050ff"/>

      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
    
      <meta name="Language" content="en" />
      <meta httpEquiv="Content-Language" content="en" />

      <meta charSet='utf-8' />
      <link rel='icon' href={icon} />
      <title>{title} | Centox</title>


      <meta property='og:title' content={title}/>
      <meta property='og:site_name' content="Centox"/>
      <meta property="og:url" content="https://centox.dk"/>
      <meta property='og:description' content={description}/>
      <meta property="og:type" content="website"/>
      <meta property="og:image" content="https://centox.dk/png/banner.png"/>

      <meta property='twitter:card' content='summary_large_image'/>
      <meta property='twitter:url' content="https://centox.dk"/>
      <meta property='twitter:title' content={title}/>
      <meta property="twitter:description" content={description}/>
      <meta property='twitter:image' content="https://centox.dk/png/banner.png"/>

    </Head>
  )
}

Meta.defaultProps = {
  title: 'Centox - Free Forum Software',
  keywords: 'Some nice keywords right here.',
  description: 'Descriptive description',
  icon: '/favicon.svg'
}

export default Meta