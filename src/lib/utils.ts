import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function trimAddress(address: string, lengt:number = 7) {
  // Check if the address is a valid string
  if (typeof address !== "string") {
    return "";
  }

  // Trim the address and add ellipses in the middle
  const trimmedAddress = address.substring(0, lengt) + "..." + address.slice(-lengt);

  return trimmedAddress;
}


export const convertTokeneformatEther= (amount:any, desimal=18)=>{
  if(amount)
 return (BigInt(amount) / BigInt(10 ** desimal)).toString();

}

// export const parseDataString = (dataString:string) => {
//   // Replace square brackets with curly braces
//   // const formattedString = dataString.replace(/\[/g, '{').replace(/\]/g, '}');

//   // Parse the string to JSON
//   try {
//     const parsedData = JSON.parse(dataString);
//     return parsedData;
//   } catch (error) {
//     console.error("Error parsing JSON:", error);
//     return null;
//   }
// };

export const parseDataString = (dataString: string) => {
  // First check if the string starts with a policy override
  if (dataString.startsWith('<POLICY_OVERRIDE>')) {
  // console.log(dataString)

    // Find the first occurrence of a JSON-like string
    const jsonStart = dataString.indexOf('{"');
    if (jsonStart === -1) return null;
    
    // Extract the JSON portion
    // const jsonPortion = dataString.slice(jsonStart);
    
    try {
      return dataString;
    } catch (error) {
      console.log("Error parsing JSON portion:", error);
      return null;
    }
  }
  
  // If no policy override, try parsing the whole string
  try {
    return JSON.parse(dataString);
  } catch (error) {
    // If parsing fails, try to find any JSON object in the string
    const match = dataString.match(/(\{.*\})/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerError) {
        console.log("Error parsing matched JSON:", innerError);
        return null;
      }
    }
    
    console.log("Error parsing JSON:", error);
    return null;
  }
};

// Helper function to check if a string is valid JSON
export function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function removeTimestamp(text:string) {
  // Use regex to remove the initial text within square brackets
  return text.replace(/^\[.*?\]\s*/, '');
}

export function trimWords(address: string | undefined, number: number) {
  // Check if the address is a valid string
  if (typeof address !== 'string') {
    return ''
  }
  if (address.length <= number + 8) {
    return address
  }
}

export const truncateText = (input:string) => {
  return input.length > 20 ? input.slice(0, 20) : input;
};
export const LocalDateTimeDisplay = (utcDate: string) => {
  // Create a Date object from the UTC date string
  const localDate = new Date(utcDate)

  // Format the date to a locale string
  const localDateTimeString = localDate.toLocaleString()

  if(localDateTimeString === "Invalid Date")
  return  ""
    
  return localDateTimeString 
}

export const extractDate = (text: string) => {
  const match = text.match(/\[(.*?)\]/)
  return match ? match[1] : ''
}

export function calculatePercentageChange(
  previousPrice: number,
  currentPrice: number
) {
  if (previousPrice === 0) {
    return {
      text: `-`,
      value: 0,
    };
  }
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  const isWholeNumber = (n: number) => n % 1 === 0;
  return {
    text: `${change > 0 ? "+" : change < 0 ? "-" : "="}${
      isWholeNumber(change) ? change : change.toFixed(2)
    }%`,
    value: change,
  }; // Returns the result rounded to two decimal places
}

export function formatBigNumber(num: any) {
  // Convert to number if string
  num = Number(num);

  // Handle invalid input
  if (isNaN(num)) {
    return "Invalid number";
  }

  // Helper function to check if a number is whole
  const isWholeNumber = (n: number) => n % 1 === 0;

  // Define thresholds
  const trillion = 1000000000000;
  const billion = 1000000000;
  const million = 1000000;
  const thousand = 1000;

  // Format with appropriate suffix
  if (Math.abs(num) >= trillion) {
    const formatted = num / trillion;
    return isWholeNumber(formatted)
      ? `${formatted}T`
      : `${formatted.toFixed(2)}T`;
  } else if (Math.abs(num) >= billion) {
    const formatted = num / billion;
    return isWholeNumber(formatted)
      ? `${formatted}B`
      : `${formatted.toFixed(2)}B`;
  } else if (Math.abs(num) >= million) {
    const formatted = num / million;
    return isWholeNumber(formatted)
      ? `${formatted}M`
      : `${formatted.toFixed(2)}M`;
  } else if (Math.abs(num) >= thousand) {
    const formatted = num / thousand;
    return isWholeNumber(formatted)
      ? `${formatted}K`
      : `${formatted.toFixed(2)}K`;
  }

  // For smaller numbers, check if it's whole
  return isWholeNumber(num) ? `${num}` : num.toFixed(2);
}
export function getHDAgentImageUrl(imageUrl: string) {
  const updatedUrl = imageUrl.replace("normal", "400x400");
  return updatedUrl;
}