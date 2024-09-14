import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStringOrArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value === 'string') {
      return true;
    }
    if (Array.isArray(value)) {
      return value.every((item: any) => typeof item === 'string');
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a string or an array of strings`;
  }
}

export function IsStringOrArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStringOrArrayConstraint,
    });
  };
}

/*import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStringOrArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            typeof value === 'string' ||
            (Array.isArray(value) &&
              value.every((item) => typeof item === 'string'))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or an array of strings`;
        },
      },
    });
  };
}*/
