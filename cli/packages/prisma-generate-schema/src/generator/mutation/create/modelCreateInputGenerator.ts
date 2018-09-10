import { ModelObjectTypeGenerator, RelatedGeneratorArgs, IGenerators, ModelInputObjectTypeGenerator, TypeFromModelGenerator, RelatedModelInputObjectTypeGenerator } from '../../generator'
import { IGQLType, IGQLField } from '../../../datamodel/model'
import { GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig, GraphQLList, GrqphQLNonNull, GraphQLInputObjectType, GraphQLString } from "graphql/type"


export default class ModelCreateInputGenerator extends ModelInputObjectTypeGenerator {

  /**
   * Generates an generator for a relational type, handling the four cases many/one and with/without related type. 
   * @param model 
   * @param field 
   * @param generators 
   */
  public static getGeneratorForRelationField(field: IGQLField, generators: IGenerators) : RelatedModelInputObjectTypeGenerator {
    if (field.relatedField !== null) {
      if (field.isList) {
        return generators.modelCreateManyWithoutRelatedInput
      } else {
        return generators.modelCreateOneWithoutRelatedInput
      }
    } else {
      if (field.isList) {
        return generators.modelCreateManyInput
      } else {
        return  generators.modelCreateOneInput
      }
    }
  }
  public static generateRelationFieldForInputType(model: IGQLType, field: IGQLField, generators: IGenerators) {
    const relationInfo = { relatedField: field, relatedType: model, relationName: field.relationName }
    const generator = ModelCreateInputGenerator.getGeneratorForRelationField(field, generators)

    if(generator.wouldBeEmpty(model, relationInfo)) {
      return null
    } else {
      return generators.scalarTypeGenerator.requiredIf(field.isRequired, generator.generate(field.type as IGQLType, relationInfo))
    }
  }

  public static generateScalarFieldTypeForInputType(model: IGQLType, field: IGQLField, generators: IGenerators) {
    if (TypeFromModelGenerator.reservedFields.includes(field.name)) {
      return null
    } else {
      if (field.isList) {
        return generators.scalarListCreateInput.generate(model, field)
      } else {
        return generators.scalarTypeGenerator.mapToScalarFieldTypeForInput(field)
      }
    }
  }

  protected wouldBeEmptyInternal(model: IGQLType, args: {}) {
    return !TypeFromModelGenerator.hasScalarFieldsExcept(model.fields, ...TypeFromModelGenerator.reservedFields) &&
           model.fields.filter(field => typeof(field.type) === 'object').every(field => {
              const generator = ModelCreateInputGenerator.getGeneratorForRelationField(field, this.generators)
              return generator.wouldBeEmpty(field.type as IGQLType, { relatedField: field, relatedType: model, relationName: field.relationName })
           })
  }

  public getTypeName(input: IGQLType, args: {}) {
    return `${input.name}CreateInput`
  }


  protected generateRelationFieldType(model: IGQLType, args: {}, field: IGQLField) {
    return ModelCreateInputGenerator.generateRelationFieldForInputType(model, field, this.generators)
  }

  protected generateScalarFieldType(model: IGQLType, args: {}, field: IGQLField) {
    return ModelCreateInputGenerator.generateScalarFieldTypeForInputType(model, field, this.generators)
  }
}