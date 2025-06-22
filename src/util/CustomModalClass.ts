import CustomModal from "@/app/components/CustomModal";

export class CustomModalClass {
    private title: string;
    private text: string;
    action: { actionName: string; parameters: Record<string, any> }; // Ex: actionName = deleteLists. parameters = list_id, user_id ...

    constructor(title:string, text:string, action: { actionName: string; parameters: Record<string, any>}){
        this.title = title;
        this.text = text;
        this.action = action;
    }

    public initModal (){
        return console.log(this.title)
    }

    public fire(){
        return  (
            <CustomModal title='hola' text='hola' action={{actionName: "", parameters: {}}}/>
        )
    }
}