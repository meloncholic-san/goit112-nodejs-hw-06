function parseIsFavourite(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}


function parseContactType (value) {
    if (typeof value === 'undefined') {
        return undefined;
    }

    const allowedTypes = ['personal', 'work', 'home'];

    return allowedTypes.includes(value) ? value : undefined;
}


export function parseFilterParams(query) {
    const {isFavourite, contactType} = query;
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    const parsedContactType = parseContactType(contactType);
    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType
    };
}