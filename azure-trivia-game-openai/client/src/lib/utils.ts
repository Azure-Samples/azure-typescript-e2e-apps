 
  export function splitString(textWithSource) { 
        const regex1 = /^(.*) \[(.*)\]\((.*)\)$/;  
        const regex2 = /^(.*)<a href='(.*)'>(.*)<\/a>(.*)$/;  
        const regex3 = /^(.*) at: (.*)$/;  
        const match1 = textWithSource.match(regex1);  
        const match2 = textWithSource.match(regex2);  
        const match3 = textWithSource.match(regex3);  
        
        if (match1) {  
          const text = match1[1].trim();  
          const sourceName = match1[2].trim();  
          const sourceUrl = match1[3].trim();  
        
          return [text, sourceName, sourceUrl];  
        } else if (match2) {  
          const text = `${match2[1].trim()}${match2[4].trim()}`;  
          const sourceName = match2[3].trim();  
          const sourceUrl = match2[2].trim();  
        
          return [text, sourceName, sourceUrl];  
        } else if (match3) {  
          const text = match3[1].trim();  
          const sourceName = 'here';  
          const sourceUrl = match3[2].trim();  
        
          return [text, sourceName, sourceUrl];  
        }  
        
        return [textWithSource.trim(), '', ''];   
      
  }  
  export function randomizeObjects(objs) {  
    const shuffledObjects = [...objs];  
  
    for (let i = shuffledObjects.length - 1; i > 0; i--) {  
      const j = Math.floor(Math.random() * (i + 1));  
      [shuffledObjects[i], shuffledObjects[j]] = [shuffledObjects[j], shuffledObjects[i]];  
    }  
    
    return shuffledObjects;
  }
    