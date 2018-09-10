import { ModelInputObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, TypeFromModelGenerator } from '../generator'
import { IGQLType, IGQLField } from '../../datamodel/model'
import { GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig, GraphQLList, GrqphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"


export default class ModelWhereUniqueInputGenerator extends ModelInputObjectTypeGenerator {
  public getTypeName(input: IGQLType, args: {}) {
    return `${input.name}WhereUniqueInput`
  }
  protected wouldBeEmptyInternal(model: IGQLType, args: {}) {
    return !TypeFromModelGenerator.hasUniqueScalarField(model.fields)
  }

  protected generateRelationFieldType(model: IGQLType, args: {}, field: IGQLField) {
    return null
  }
  protected generateScalarFieldType(model: IGQLType, args: {}, field: IGQLField) {
    if (field.isUnique) {
      return this.generators.scalarTypeGenerator.mapToScalarFieldTypeForceOptional(field)
    } else {
      return null
    }
  }
}