import { ModelObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, RelatedModelInputObjectTypeGenerator, TypeFromModelGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig, GraphQLList, GrqphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"
import ModelUpdateInputGenerator from './modelUpdateInputGenerator';
import { capitalize, plural } from '../../../util/util';


export default class ModelUpdateWithoutRelatedInputGenerator extends RelatedModelInputObjectTypeGenerator {
  protected wouldBeEmptyInternal(model: IGQLType, args: RelatedGeneratorArgs) {
    return !TypeFromModelGenerator.hasScalarFieldsExcept(model.fields, ...TypeFromModelGenerator.reservedFields) &&
            model.fields.filter(field => typeof(field.type) === 'object' && field.relatedField !== args.relatedField).every(field => {
              const generator = ModelUpdateInputGenerator.getGeneratorForRelationField(field, this.generators)
              return generator.wouldBeEmpty(field.type as IGQLType, { relatedField: field, relatedType: model, relationName: field.relationName })
            })
  }

  
  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    const field = args.relatedField.relatedField as IGQLField
    return `${input.name}UpdateWithout${capitalize(field.name)}DataInput`
  }

  protected generateScalarFieldType(model: IGQLType, args: {}, field: IGQLField) {
    return ModelUpdateInputGenerator.generateScalarFieldTypeForInputType(model, field, this.generators)
  }

  protected generateRelationFieldType(model: IGQLType, args: RelatedGeneratorArgs, field: IGQLField) {
    if (field.relatedField === args.relatedField) {
      return null
    }
    return ModelUpdateInputGenerator.generateRelationFieldForInputType(model, field, this.generators)
  }
}