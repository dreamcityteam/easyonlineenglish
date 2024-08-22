import axios from "axios";

export const statusCode = async (url3d: any, creq: any, pareq: any, Termurl: any) => {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = url3d;

    const hiddenFieldCreq = document.createElement('input');
    hiddenFieldCreq.type = 'hidden';
    hiddenFieldCreq.name = 'creq';
    hiddenFieldCreq.value = creq;

    const hiddenFieldMD = document.createElement('input');
    hiddenFieldMD.type = 'hidden';
    hiddenFieldMD.name = 'MD';
    hiddenFieldMD.value = creq;

    const hiddenFieldPaReq = document.createElement('input');
    hiddenFieldPaReq.type = 'hidden';
    hiddenFieldPaReq.name = 'PaReq';
    hiddenFieldPaReq.value = pareq;

    const hiddenFieldTermUrl = document.createElement('input');
    hiddenFieldTermUrl.type = 'hidden';
    hiddenFieldTermUrl.name = 'TermUrl';
    hiddenFieldTermUrl.value = Termurl;

    if (pareq !== "") {
        form.appendChild(hiddenFieldMD);
        form.appendChild(hiddenFieldPaReq);
    }
    if (creq !== "") {
        form.appendChild(hiddenFieldCreq);
    }
    form.appendChild(hiddenFieldTermUrl);

    document.body.appendChild(form);
    //window.onbeforeunload = null;
    //window.alert = () => {}
    form.submit();
    //window.onbeforeunload = null;
    //window.alert = () => {}

}

export const launcher = (data: any, endpoint: string) => {
    return axios.post(endpoint, JSON.stringify(data))
}