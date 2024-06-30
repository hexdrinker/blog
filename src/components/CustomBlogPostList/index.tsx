import './styles.scss'

interface Props {
  children: React.ReactNode
}

const CustomBlogPostList = ({ children }: Props) => {
  return <div className='CustomBlogPostList'>{children}</div>
}

export default CustomBlogPostList
