import './styles.scss'

interface Props {
  thumbnail: string
  title: string
  description: string
  link: string
}

const CustomBlogPostItem = ({ thumbnail, title, description, link }: Props) => {
  return (
    <a
      href={link}
      className='CustomBlogPostItem'
    >
      <div className='CustomBlogPostItem__thumbnailWrapper'>
        <div
          style={{ backgroundImage: `url(${thumbnail})` }}
          className='CustomBlogPostItem__thumbnail'
        ></div>
      </div>
      <h3 className='CustomBlogPostItem__title'>{title}</h3>
      <p className='CustomBlogPostItem__description'>{description}</p>
    </a>
  )
}

export default CustomBlogPostItem
