import { ModelObjectTypeGenerator, RelatedGeneratorArgs, RelatedModelInputObjectTypeGenerator, TypeFromModelGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLFieldConfigMap, GraphQLInputFieldConfig, GraphQLList, GrqphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"
import ModelCreateInputGenerator from './modelCreateInputGenerator';
import { plural, camelCase, capitalize } from '../../../util/util';


export default class ModelCreateWithoutRelatedInputGenerator extends RelatedModelInputObjectTypeGenerator {
  
  protected wouldBeEmptyInternal(model: IGQLType, args: RelatedGeneratorArgs) {
    return !TypeFromModelGenerator.hasScalarFieldsExcept(model.fields, ...TypeFromModelGenerator.reservedFields) &&
           model.fields.filter(field => typeof(field.type) === 'object' && field.relatedField !== args.relatedField).every(field => {
              const generator = ModelCreateInputGenerator.getGeneratorForRelationField(field, this.generators)
              return generator.wouldBeEmpty(field.type as IGQLType, { relatedField: field, relatedType: model, relationName: field.relationName })
           })
  }

  public getTypeName(input: IGQLType, args: RelatedGeneratorArgs) {
    const field = (args.relatedField.relatedField as IGQLField)
    return `${input.name}CreateWithout${capitalize(field.name)}Input`
  }

  protected generateScalarFieldType(model: IGQLType, args: {}, field: IGQLField) {
    return ModelCreateInputGenerator.generateScalarFieldTypeForInputType(model, field, this.generators)
  }

  protected generateRelationFieldType(model: IGQLType, args: RelatedGeneratorArgs, field: IGQLField) {
    // Well. We just skip opposite fields. 
    if (field.relatedField === args.relatedField) {
      return null
    }

    return ModelCreateInputGenerator.generateRelationFieldForInputType(model, field, this.generators)
  }
}