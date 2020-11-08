const abbreviationBody = '{{[ \\t]*(start|end|custom|customStart|customEnd)[ \\t]+(\\S*)[ \\t]*}}'
export const regExTemplateAbbreviation = new RegExp(abbreviationBody, 'g')
