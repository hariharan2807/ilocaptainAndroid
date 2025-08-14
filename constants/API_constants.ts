// export const BASE_URL = "https://arbitration.appsarasan.com/"
export const BASE_URL = 'https://booking.iloconnect.in/';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const primaryColorBG = '#29627F';
export const LRedlog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[91m ${a}------------------------->`, b, '\x1b[0m');
  console.log('');
};
export const Redlog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[31m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};
export const Redlog3 = (a: any, b: any, err: any) => {
  console.log('');
  console.log(`\x1b[31m ${a}------------------------->\x1b[0m`, b, err);
  console.log('');
};
export const Greenlog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[32m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};
export const Yellowlog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[33m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};
export const Bluelog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[34m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};

export const Pinklog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[35m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};
export const LBluelog = (a: any, b: any) => {
  console.log('');
  console.log(`\x1b[36m ${a}------------------------->\x1b[0m`, b);
  console.log('');
};

export const Isstring = (params: string, data: string) => {
  const value = params;
  const isLoading = `${data} Loading`;
  try {
    if (typeof value === 'string') {
      return params;
    } else if (typeof value === 'number') {
      return `${params}`;
    } else {
      throw 'Not string';
    }
  } catch (err) {
    Redlog3('Isstring handle', data, err);
    return isLoading;
  }
};
export const Itsstring = (params: string) => {
  const value = params;
  const isLoading =false;
  try {
    if (typeof value === 'string') {
      return true;
    } else {
      throw 'Not string';
    }
  } catch (err) {
    Redlog('Isstring handle', err);
    return isLoading;
  }
};
export const IsNumber = (params: any, data: string) => {
  const value = params;
  const isLoading = 0;
  try {
    if (typeof value === 'string') {
      const stringdata = parseInt(value, 2);
      if (typeof stringdata === 'number') {
        return stringdata;
      } else {
        throw 'Not Number but string';
      }
    } else if (typeof value === 'number') {
      return params;
    } else {
      throw 'Not Number but not string';
    }
  } catch (err) {
    Redlog3('IsNumber handle ', data, err);
    return isLoading;
  }
};
export const IsArray = (params: []) => {
  const value = params;
  try {
    if (Array.isArray(value)) {
      return params;
    } else if (Object.prototype.toString.call(value) === '[object Array]') {
      return params;
    } else {
      throw 'Not Array';
    }
  } catch (err) {
    Redlog('IsArray handle', err);
    return [];
  }
};
export const IsObject = (params: {}) => {
  const value = params;
  try {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return true;
    } else if (Object.prototype.toString.call(value) === '[object object]') {
      return true;
    } else {
      throw 'Not Object';
    }
  } catch (err) {
    Redlog('IsObject handle', err);
    return false;
  }
};