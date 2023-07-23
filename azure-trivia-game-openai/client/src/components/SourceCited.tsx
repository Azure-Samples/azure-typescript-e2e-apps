
import { Link, Typography } from '@mui/material/';  
  
type Props = {  
  data: string[] 
};  
  
const Explanation = (props: Props) => {  

    console.log(`Explanation: ${props.data[0]}`)

    console.log(`Source Text: ${props.data[1]}`)
    console.log(`Source URL: ${props.data[2]}`)

  return (  
    <>
    <Typography>
        {props.data[0]}
    </Typography>
    <Typography>  
      <Link href={props.data[2]} target="_blank" rel="noopener">  
        {props.data[1]}
      </Link>  
    </Typography>  
    </>
  );  
};  
  
export default Explanation;  